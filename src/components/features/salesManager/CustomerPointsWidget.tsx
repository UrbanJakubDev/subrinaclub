import CustomersActiveWidget from '@/components/ui/stats/cardsWidgets/customersActiveWidget';
import React from 'react';


type CustomerPointsWidgetProps = {
    selectedQuarter: number;
    clubPoints: number;
    quarterPoints: number[];
    yearPoints: number;
    customersCountsInfo: {
        allCustomers: number;
        activeCustomers: number;
    }
}

const basicCard = (title: string, value: number, icon: string, selected: boolean = false) => {

    
    const formattedValue = value.toLocaleString();
    return (
        <div className={`bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center shadow-sm border border-gray-200 ${selected ? "bg-gray-400" : ""}`}>
            <p className="text-gray-600 text-xs">{title}</p>
            <p className="text-lg font-semibold text-gray-700">{formattedValue}</p>
            {/* <div className="text-gray-600 text-xs">{icon}</div> */}
        </div>
    )
}


const CustomerPointsWidget = ({ selectedQuarter, quarterPoints, customersCountsInfo, clubPoints, yearPoints }: CustomerPointsWidgetProps) => {
    return (
        <>
            <div className="bg-white rounded-lg shadow-md p-6"> {/* Hlavní kontejner widgetu */}
                {/* Hlavička widgetu */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">{`Přehled bodů zákazníků`}</h3> {/* Název widgetu */}
                </div>

                {/* Klíčové metriky - horní boxy */}
                <div className="border-b border-gray-200 ">
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        {/* Celkem bodů - Výrazný box */}
                        {basicCard("Klubové konto", clubPoints, "💰")}
                        {basicCard("Roční konto", yearPoints, "📈")}
                        {basicCard("Rozdíl", quarterPoints[selectedQuarter - 1], "📈")}
                        {basicCard("Rozdíl kladný", quarterPoints[selectedQuarter - 1], "📈")}
                    </div>
                    <div className="grid grid-cols-5 gap-4 mb-6">
                        {/* Body za čtvrtletí - Menší boxy */}
                        {basicCard(`Průměr za poslední 4 čtvrtletí`, quarterPoints[selectedQuarter - 1], "📈")}
                        {quarterPoints.map((points, index) => (
                            basicCard(`Q${index + 1}`, points, "📈", index === selectedQuarter - 1)
                        ))}
                    </div>
                </div>

            </div>
            <CustomersActiveWidget
                title="Přehled aktivních/neaktivních zákazníků"
                allCustomers={customersCountsInfo.allCustomers}
                activeCustomers={customersCountsInfo.activeCustomers}
            />
        </>

    );
};

export default CustomerPointsWidget;