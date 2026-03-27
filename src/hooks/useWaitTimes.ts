import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { AirportWaitSummary, CheckpointWait, WaitReport, HourlyData } from '../lib/types';

export function useAirportSummaries() {
  const [summaries, setSummaries] = useState<AirportWaitSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      // Get current wait times from the view
      const { data: waitData } = await supabase
        .from('current_wait_times')
        .select('*');

      // Get checkpoint wait times
      const { data: cpData } = await supabase
        .from('checkpoint_wait_times')
        .select('*');

      if (waitData && cpData) {
        const mapped: AirportWaitSummary[] = waitData.map((w: any) => {
          const checkpoints: CheckpointWait[] = cpData
            .filter((cp: any) => cp.airport_code === w.code)
            .map((cp: any) => ({
              id: cp.id,
              name: cp.name,
              terminal: cp.terminal,
              isPrecheck: cp.is_precheck,
              avgWait: cp.avg_wait || 0,
              reportCount: cp.report_count || 0,
              lastReport: cp.last_report,
              trend: 'stable' as const, // TODO: compute from historical
            }));

          return {
            code: w.code,
            name: w.name,
            city: w.city,
            state: w.state,
            avgWait: w.avg_wait || 0,
            minWait: w.min_wait || 0,
            maxWait: w.max_wait || 0,
            reportCount: w.report_count || 0,
            lastReport: w.last_report,
            checkpoints,
          };
        });
        setSummaries(mapped);
      }
      setLoading(false);
    }

    fetch();

    // Subscribe to new reports for real-time updates
    const channel = supabase
      .channel('wait_reports_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'wait_reports' }, () => {
        fetch(); // Refetch on new report
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return { summaries, loading };
}

export function useLiveReports(airportCode?: string) {
  const [reports, setReports] = useState<WaitReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      let query = supabase
        .from('wait_reports')
        .select(`
          id,
          airport_code,
          checkpoint_id,
          wait_minutes,
          reported_at,
          source_type,
          source_text,
          source_url,
          checkpoints!inner(name, terminal)
        `)
        .order('reported_at', { ascending: false })
        .limit(20);

      if (airportCode) {
        query = query.eq('airport_code', airportCode);
      }

      const { data } = await query;

      if (data) {
        const mapped: WaitReport[] = data.map((r: any) => ({
          id: r.id,
          airportCode: r.airport_code,
          checkpointId: r.checkpoint_id,
          checkpointName: r.checkpoints?.name || '',
          waitMinutes: r.wait_minutes,
          reportedAt: r.reported_at,
          terminal: r.checkpoints?.terminal || '',
          sourceType: r.source_type || 'user',
          sourceText: r.source_text || undefined,
          sourceUrl: r.source_url || undefined,
        }));
        setReports(mapped);
      }
      setLoading(false);
    }

    fetch();

    const channel = supabase
      .channel('live_reports')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'wait_reports' }, () => {
        fetch();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [airportCode]);

  return { reports, loading };
}

export function useHourlyData(airportCode: string) {
  const [data, setData] = useState<HourlyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      // Get all reports for today for this airport
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const { data: reports } = await supabase
        .from('wait_reports')
        .select('wait_minutes, reported_at')
        .eq('airport_code', airportCode)
        .gte('reported_at', startOfDay.toISOString())
        .order('reported_at', { ascending: true });

      if (reports) {
        // Group by hour
        const hourMap = new Map<number, { total: number; count: number }>();
        for (const r of reports) {
          const hour = new Date(r.reported_at).getHours();
          const existing = hourMap.get(hour) || { total: 0, count: 0 };
          existing.total += r.wait_minutes;
          existing.count += 1;
          hourMap.set(hour, existing);
        }

        const hourly: HourlyData[] = [];
        for (let h = 4; h <= 23; h++) {
          const entry = hourMap.get(h);
          hourly.push({
            hour: h,
            avgWait: entry ? Math.round(entry.total / entry.count) : 0,
            reportCount: entry?.count || 0,
          });
        }
        setData(hourly);
      }
      setLoading(false);
    }

    fetch();
  }, [airportCode]);

  return { data, loading };
}

export async function submitReport(airportCode: string, checkpointId: string, waitMinutes: number) {
  const { error } = await supabase
    .from('wait_reports')
    .insert({
      airport_code: airportCode,
      checkpoint_id: checkpointId,
      wait_minutes: waitMinutes,
    })
    .select()
    .single();

  // If the select fails due to RLS, try with minimal return
  if (error?.code === '42501') {
    const { error: minError } = await supabase
      .from('wait_reports')
      .insert({
        airport_code: airportCode,
        checkpoint_id: checkpointId,
        wait_minutes: waitMinutes,
      });
    if (minError) throw minError;
    return;
  }

  if (error) throw error;
}
