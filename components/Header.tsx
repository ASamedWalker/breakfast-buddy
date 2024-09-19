import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"


const Header: React.FC = () => {
  return (
    <Card className="mb-8 bg-gradient-to-r from-orange-400 to-orange-600">
      <CardHeader>
        <CardTitle className="text-4xl text-center text-white">Breakfast Buddy</CardTitle>
        <CardDescription className="text-center text-white text-lg">
          Your AI-powered breakfast inspiration for quick, on-the-go options
        </CardDescription>
      </CardHeader>
    </Card>
  );
};

export default Header;