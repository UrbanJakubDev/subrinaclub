import React from 'react';


type CustomerPointsWidgetProps = {
    selectedQuarter: number;
    clubPoints: number;
    quarterPoints: number[];
    yearPoints: number;
    averagePointsForSelectedQuarter: number;
    selectedQuarterDifference: number;
    customersCountsInfo: {
        allCustomers: number;
        activeCustomers: number;
    }
}

const CustomerPointsWidget = ({ selectedQuarter, quarterPoints, customersCountsInfo, clubPoints, yearPoints, averagePointsForSelectedQuarter, selectedQuarterDifference }: CustomerPointsWidgetProps) => {
    // Dummy data pro demonstraci - nahradit reálnými daty z API
    const agentName = "Formánková Darina";

    const selectedQuarterStyle = "bg-blue-100";


    return (
        <div className="bg-white rounded-lg shadow-md p-6"> {/* Hlavní kontejner widgetu */}
            {/* Hlavička widgetu */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{`Přehled bodů zákazníků`}</h3> {/* Název widgetu */}
            </div>

            {/* Klíčové metriky - horní boxy */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                {/* Celkem bodů - Výrazný box */}
                <div className="col-span-1 bg-blue-100 rounded-lg p-4 flex flex-col items-center justify-center">
                    <p className="text-gray-700 text-sm mb-1">Klubové konto</p>
                    <p className="text-2xl font-bold text-blue-800">{clubPoints}</p>
                </div>
                <div className="col-span-1 bg-blue-100 rounded-lg p-4 flex flex-col items-center justify-center">
                    <p className="text-gray-700 text-sm mb-1">Roční konto</p>
                    <p className="text-2xl font-bold text-blue-800">{yearPoints}</p>
                </div>
                <div className="col-span-1 bg-blue-100 rounded-lg p-4 flex flex-col items-center justify-center">
                    <p className="text-gray-700 text-sm mb-1">Bodů za čtvrtletí</p>
                    <p className="text-2xl font-bold text-blue-800">{averagePointsForSelectedQuarter}</p>
                </div>
                <div className="col-span-1 bg-blue-100 rounded-lg p-4 flex flex-col items-center justify-center">
                    <p className="text-gray-700 text-sm mb-1">Rozdíl</p>
                    <p className="text-2xl font-bold text-blue-800">{selectedQuarterDifference}</p>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-6">
                {/* Body za čtvrtletí - Menší boxy */}
                {quarterPoints.map((points, index) => (
                    <div key={index} className={`bg-gray-50 rounded-lg p-2 flex flex-col items-center justify-center ${index === selectedQuarter - 1 ? selectedQuarterStyle : ""}`}>
                        <p className="text-gray-600 text-xs">Q{index + 1}</p>
                        <p className="text-lg font-semibold text-gray-700">{points}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center">
                    <p className="text-gray-600 text-xs">Celkový počet zákazníků</p>
                    <p className="text-lg font-semibold text-gray-700">{customersCountsInfo.allCustomers}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center">
                    <p className="text-gray-600 text-xs">Celkový počet aktivních zákazníků</p>
                    <p className="text-lg font-semibold text-gray-700">{customersCountsInfo.activeCustomers}</p>
                </div>
              
                <pre>
                    {JSON.stringify(customersCountsInfo, null, 2)}
                </pre>
            </div>



            {/* Souhrnná statistika - Menší číslo pod grafem */}
            <div className="mb-6">
                <p className="text-sm text-gray-600">Součet bodů všech zástupců:</p>
                <p className="text-lg font-semibold text-gray-700">{0}</p>
            </div>


        </div>
    );
};

export default CustomerPointsWidget;