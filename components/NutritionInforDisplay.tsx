import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailedNutritionInfo } from '../types';

interface NutritionInfoDisplayProps {
  calories: string;
  detailedInfo?: DetailedNutritionInfo;
}

const NutritionInfoDisplay: React.FC<NutritionInfoDisplayProps> = ({ calories, detailedInfo }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nutrition Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <div>Calories: {calories}</div>
          {detailedInfo && (
            <>
              <div>Protein: {detailedInfo.protein}g</div>
              <div>Carbs: {detailedInfo.carbs}g</div>
              <div>Fat: {detailedInfo.fat}g</div>
              <div>Fiber: {detailedInfo.fiber}g</div>
              <div>Sugar: {detailedInfo.sugar}g</div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionInfoDisplay;