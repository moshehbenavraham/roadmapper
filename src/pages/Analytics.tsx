import { useWorkspaceSetup, useRoadmaps } from "@/hooks/useRoadmap";
import { useAnalyticsData } from "@/hooks/useAnalytics";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Route, CheckCircle2, Clock, AlertTriangle, Layers } from "lucide-react";
import { useState, useMemo } from "react";
import { useTheme } from "next-themes";
import SEOHead from "@/components/SEOHead";

// Brand-aligned chart palettes for the Emerald design system.
// In light mode the original deep-emerald hues sit on a cream surface; in dark
// mode those same hues blend into the dark background (especially `high` at
// 10% lightness, which is essentially the dark bg color). Picking a paired
// dark palette keeps every series visible without losing brand identity.
const LIGHT_CHART_COLORS = {
  completed: "hsl(160, 84%, 18%)",
  in_progress: "hsl(160, 84%, 32%)",
  planned: "hsl(60, 20%, 80%)",
  high: "hsl(160, 50%, 10%)",
  medium: "hsl(160, 84%, 28%)",
  low: "hsl(60, 20%, 80%)",
};

const DARK_CHART_COLORS = {
  completed: "hsl(160, 65%, 60%)",
  in_progress: "hsl(160, 70%, 45%)",
  planned: "hsl(60, 12%, 58%)",
  high: "hsl(160, 75%, 70%)",
  medium: "hsl(160, 70%, 45%)",
  low: "hsl(60, 12%, 58%)",
};

// Tooltip / grid / axis chrome must follow the theme too — the original
// hardcoded `hsl(60, 20%, 97.5%)` tooltip background reads as a glaring
// near-white panel on the dark surface, and the gray axis labels disappear.
const LIGHT_CHART_CHROME = {
  tooltipBg: "hsl(60, 20%, 97.5%)",
  tooltipBorder: "hsl(60, 15%, 87%)",
  tooltipText: "hsl(0, 0%, 9%)",
  gridStroke: "hsl(60, 15%, 87%)",
  axisStroke: "hsl(60, 15%, 87%)",
  axisTick: "hsl(0, 0%, 40%)",
};

const DARK_CHART_CHROME = {
  tooltipBg: "hsl(160, 40%, 10%)",
  tooltipBorder: "hsl(160, 25%, 18%)",
  tooltipText: "hsl(60, 15%, 88%)",
  gridStroke: "hsl(160, 25%, 18%)",
  axisStroke: "hsl(160, 25%, 18%)",
  axisTick: "hsl(60, 10%, 55%)",
};

export default function Analytics() {
  const { data: setup, isLoading: setupLoading } = useWorkspaceSetup();
  const workspaceId = setup?.workspaceId;
  const { data: roadmaps = [] } = useRoadmaps(workspaceId);
  const { items, isLoading } = useAnalyticsData(workspaceId);
  const navigate = useNavigate();
  const [activeRoadmapId, setActiveRoadmapId] = useState<string | null>(null);

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const COLORS = useMemo(
    () => (isDark ? DARK_CHART_COLORS : LIGHT_CHART_COLORS),
    [isDark]
  );
  const chrome = useMemo(
    () => (isDark ? DARK_CHART_CHROME : LIGHT_CHART_CHROME),
    [isDark]
  );
  const tooltipContentStyle = useMemo(
    () => ({
      background: chrome.tooltipBg,
      border: `1px solid ${chrome.tooltipBorder}`,
      borderRadius: "8px",
      fontFamily: "Figtree, sans-serif",
      fontSize: "13px",
      color: chrome.tooltipText,
    }),
    [chrome]
  );
  const tooltipItemStyle = useMemo(
    () => ({ color: chrome.tooltipText }),
    [chrome]
  );

  const handleSelectRoadmap = (id: string) => {
    setActiveRoadmapId(id);
    navigate("/app");
  };

  if (setupLoading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="font-display text-sm text-muted-foreground animate-fade-in">Loading analytics…</p>
      </div>
    );
  }

  const totalRoadmaps = roadmaps.length;
  const totalItems = items.length;
  const completedItems = items.filter((i) => i.status === "completed").length;
  const inProgressItems = items.filter((i) => i.status === "in_progress").length;
  const plannedItems = items.filter((i) => i.status === "planned").length;
  const highPriorityItems = items.filter((i) => i.priority === "high").length;

  const statusData = [
    { name: "Completed", value: completedItems, color: COLORS.completed },
    { name: "In Progress", value: inProgressItems, color: COLORS.in_progress },
    { name: "Planned", value: plannedItems, color: COLORS.planned },
  ];

  const priorityData = [
    { name: "High", count: highPriorityItems, fill: COLORS.high },
    { name: "Medium", count: items.filter((i) => i.priority === "medium").length, fill: COLORS.medium },
    { name: "Low", count: items.filter((i) => i.priority === "low").length, fill: COLORS.low },
  ];

  const kpis = [
    { label: "Total Roadmaps", value: totalRoadmaps, icon: Route },
    { label: "Total Items", value: totalItems, icon: Layers },
    { label: "Completed", value: completedItems, icon: CheckCircle2 },
    { label: "In Progress", value: inProgressItems, icon: Clock },
    { label: "High Priority", value: highPriorityItems, icon: AlertTriangle },
  ];

  return (
    <SidebarProvider>
        <SEOHead
          title="Analytics — Roadmapper"
          description="Track roadmap progress with status breakdowns, priority distribution, and key performance metrics."
          url="/app/analytics"
        />
        <div className="min-h-screen flex w-full">
        <AppSidebar
          roadmaps={roadmaps}
          activeRoadmapId={activeRoadmapId}
          onSelectRoadmap={handleSelectRoadmap}
          onCreateRoadmap={() => navigate("/app")}
          workspaceId={workspaceId ?? null}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-11 flex items-center border-b bg-background px-3 shrink-0">
            <SidebarTrigger className="h-7 w-7" />
            <span className="font-display text-sm font-medium text-foreground ml-2">Analytics</span>
          </header>

          <div className="flex-1 overflow-auto p-6 md:p-10">
            <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">Analytics</h1>
                <p className="font-body text-sm text-muted-foreground mt-1">
                  Overview of your workspace roadmaps and items
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {kpis.map((kpi) => (
                  <Card key={kpi.label}>
                    <CardContent className="p-4 flex flex-col items-center gap-2">
                      <kpi.icon className="h-5 w-5 text-primary" />
                      <span className="font-display text-2xl font-bold text-foreground">{kpi.value}</span>
                      <span className="font-body text-xs text-muted-foreground text-center">{kpi.label}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Donut Chart */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="font-display text-base">Items by Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={3}
                          dataKey="value"
                          stroke="none"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={tooltipContentStyle}
                          itemStyle={tooltipItemStyle}
                          labelStyle={tooltipItemStyle}
                          cursor={{ fill: chrome.gridStroke, opacity: 0.4 }}
                        />
                        <Legend
                          formatter={(value) => (
                            <span className="font-body text-xs text-foreground">{value}</span>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Bar Chart */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="font-display text-base">Items by Priority</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={priorityData} barSize={40}>
                        <CartesianGrid strokeDasharray="3 3" stroke={chrome.gridStroke} vertical={true} horizontal={false} />
                        <XAxis
                          dataKey="name"
                          tick={{ fontFamily: "Figtree, sans-serif", fontSize: 12, fill: chrome.axisTick }}
                          axisLine={{ stroke: chrome.axisStroke }}
                          tickLine={false}
                        />
                        <YAxis
                          allowDecimals={false}
                          tick={{ fontFamily: "Figtree, sans-serif", fontSize: 12, fill: chrome.axisTick }}
                          axisLine={{ stroke: chrome.axisStroke }}
                          tickLine={false}
                        />
                        <Tooltip
                          contentStyle={tooltipContentStyle}
                          itemStyle={tooltipItemStyle}
                          labelStyle={tooltipItemStyle}
                          cursor={{ fill: chrome.gridStroke, opacity: 0.4 }}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                          {priorityData.map((entry, index) => (
                            <Cell key={`bar-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
