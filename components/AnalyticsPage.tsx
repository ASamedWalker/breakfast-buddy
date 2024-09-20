import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { SavedSuggestion } from "../types";

interface AnalyticsPageProps {
  savedSuggestions: SavedSuggestion[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AnalyticsPage = ({ savedSuggestions }: AnalyticsPageProps) => {
  // Function to count occurrences of each item
  const getItemCounts = () => {
    const counts: { [key: string]: number } = {};
    savedSuggestions.forEach((suggestion) => {
      counts[suggestion.item] = (counts[suggestion.item] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const getMoodCounts = () => {
    const counts: { [key: string]: number } = {};
    savedSuggestions.forEach((suggestion) => {
      if (suggestion.mood) {
        counts[suggestion.mood] = (counts[suggestion.mood] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const getWeatherCounts = () => {
    const counts: { [key: string]: number } = {};
    savedSuggestions.forEach((suggestion) => {
      if (suggestion.weather) {
        counts[suggestion.weather] = (counts[suggestion.weather] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const itemCounts = getItemCounts();
  const moodCounts = getMoodCounts();
  const weatherCounts = getWeatherCounts();

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Your Breakfast Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold mb-4">
          Most Common Breakfast Choices
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={itemCounts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Breakfast by Mood</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={moodCounts}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {moodCounts.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Breakfast by Weather</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={weatherCounts}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {weatherCounts.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};


export default AnalyticsPage;
