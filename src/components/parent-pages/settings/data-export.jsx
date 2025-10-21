import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Image, Card, Checkbox } from "@heroui/react";
import { ArrowLeftIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import Navbar from "../../nav-bar/navbar";
import Select from "../../custom-select/CustomSelect";
import { auth } from "../../../firebase/firebaseAuth";
import axios from "axios";
import API_URL from "../../../config/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./settings.css";
import { FiBell } from "react-icons/fi";

export default function DataExport() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [userData, setUserData] = useState(null);
    const [babies, setBabies] = useState([]);
    const [selectedBaby, setSelectedBaby] = useState(null);

    const [exportOptions, setExportOptions] = useState({
        growthCharts: true,
        sleepAnalytics: true,
        medications: true,
        allergies: true,
        vaccinations: true,
        feedingNotes: false,
        observationNotes: false
    });

    useEffect(() => {
        const fetchData = async () => {
            const currentUser = auth.currentUser;
            if (!currentUser) return;

            try {
                const idToken = await currentUser.getIdToken();
                const response = await axios.post(
                    `${API_URL}/api/sign-in`,
                    { idToken },
                    { withCredentials: true }
                );
                setUserData(response.data.user);
                setBabies(response.data.babyData || []);

                if (response.data.babyData && response.data.babyData.length > 0) {
                    setSelectedBaby({
                        value: response.data.babyData[0].baby_id,
                        label: `${response.data.babyData[0].first_name} ${response.data.babyData[0].last_name}`
                    });
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCheckboxChange = (key) => {
        setExportOptions(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString();
    };

    const generatePDF = async () => {
        if (!selectedBaby || !selectedBaby.value) {
            alert("Please select a baby");
            return;
        }

        setGenerating(true);

        try {
            const babyId = selectedBaby.value;
            const baby = babies.find(b => b.baby_id === babyId);

            if (!baby) {
                alert("Baby not found");
                setGenerating(false);
                return;
            }

            // Fetch all selected data
            const dataPromises = [];

            if (exportOptions.growthCharts) {
                dataPromises.push(
                    axios.get(`${API_URL}/api/growth`, {
                        params: { baby_id: babyId },
                        withCredentials: true
                    }).then(res => ({ type: 'growth', data: res.data }))
                );
            }

            if (exportOptions.sleepAnalytics) {
                dataPromises.push(
                    axios.get(`${API_URL}/api/sleep`, {
                        params: { baby_id: babyId },
                        withCredentials: true
                    }).then(res => ({ type: 'sleep', data: res.data }))
                );
            }

            if (exportOptions.medications) {
                dataPromises.push(
                    axios.get(`${API_URL}/api/meds`, {
                        params: { baby_id: babyId },
                        withCredentials: true
                    }).then(res => ({ type: 'meds', data: res.data }))
                );
            }

            if (exportOptions.allergies) {
                dataPromises.push(
                    axios.get(`${API_URL}/api/allergies`, {
                        params: { baby_id: babyId },
                        withCredentials: true
                    }).then(res => ({ type: 'allergies', data: res.data }))
                );
            }

            if (exportOptions.vaccinations) {
                dataPromises.push(
                    axios.get(`${API_URL}/api/vaccinations`, {
                        params: { baby_id: babyId },
                        withCredentials: true
                    }).then(res => ({ type: 'vaccinations', data: res.data }))
                );
            }

            if (exportOptions.feedingNotes) {
                dataPromises.push(
                    axios.get(`${API_URL}/api/feeding`, {
                        params: { baby_id: babyId },
                        withCredentials: true
                    }).then(res => ({ type: 'feeding', data: res.data }))
                );
            }

            if (exportOptions.observationNotes) {
                dataPromises.push(
                    axios.get(`${API_URL}/api/observation`, {
                        params: { baby_id: babyId },
                        withCredentials: true
                    }).then(res => ({ type: 'observation', data: res.data }))
                );
            }

            const results = await Promise.all(dataPromises);

            // Create PDF
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            let yPosition = 20;

            // Header with logo styling
            doc.setFillColor(189, 227, 195);
            doc.rect(0, 0, pageWidth, 40, 'F');

            doc.setFontSize(24);
            doc.setTextColor(76, 175, 80);
            doc.setFont(undefined, 'bold');
            doc.text('ParentPal', pageWidth / 2, 20, { align: 'center' });

            doc.setFontSize(12);
            doc.setTextColor(100, 100, 100);
            doc.setFont(undefined, 'normal');
            doc.text('Health & Development Report', pageWidth / 2, 30, { align: 'center' });

            yPosition = 55;

            // Baby Information Section
            doc.setFontSize(16);
            doc.setTextColor(76, 175, 80);
            doc.setFont(undefined, 'bold');
            doc.text('Child Information', 15, yPosition);

            yPosition += 10;
            doc.setFontSize(11);
            doc.setTextColor(60, 60, 60);
            doc.setFont(undefined, 'normal');

            const babyInfo = [
                ['Full Name:', `${baby.first_name || ''} ${baby.last_name || ''}`],
                ['Date of Birth:', formatDate(baby.birth_date)],
                ['Gender:', baby.gender || 'N/A'],
                ['Category:', baby.category || 'N/A'],
                ['Report Generated:', new Date().toLocaleDateString()]
            ];

            babyInfo.forEach(([label, value]) => {
                doc.setFont(undefined, 'bold');
                doc.text(label, 15, yPosition);
                doc.setFont(undefined, 'normal');
                doc.text(value || 'N/A', 70, yPosition);
                yPosition += 7;
            });

            yPosition += 5;

            // Add each selected data section
            results.forEach((result) => {
                if (yPosition > 250) {
                    doc.addPage();
                    yPosition = 20;
                }

                switch (result.type) {
                    case 'growth':
                        if (result.data && result.data.length > 0) {
                            doc.setFontSize(14);
                            doc.setTextColor(76, 175, 80);
                            doc.setFont(undefined, 'bold');
                            doc.text('Growth Charts', 15, yPosition);
                            yPosition += 8;

                            autoTable(doc, {
                                startY: yPosition,
                                head: [['Date', 'Height', 'Weight']],
                                body: result.data.map(record => [
                                    formatDate(record.date) || 'N/A',
                                    record.height ? `${record.height}"` : 'N/A',
                                    record.weight ? `${record.weight} lbs` : 'N/A'
                                ]),
                                theme: 'grid',
                                headStyles: { fillColor: [189, 227, 195], textColor: [76, 175, 80], fontStyle: 'bold' },
                                styles: { fontSize: 10 },
                                margin: { left: 15, right: 15 }
                            });
                            yPosition = doc.lastAutoTable.finalY + 10;
                        }
                        break;

                    case 'sleep':
                        if (result.data && result.data.length > 0) {
                            doc.setFontSize(14);
                            doc.setTextColor(76, 175, 80);
                            doc.setFont(undefined, 'bold');
                            doc.text('Sleep Analytics', 15, yPosition);
                            yPosition += 8;

                            autoTable(doc, {
                                startY: yPosition,
                                head: [['Date', 'Duration (hrs)', 'Fell Asleep At']],
                                body: result.data.map(record => [
                                    formatDate(record.date) || 'N/A',
                                    record.sleep_duration || 'N/A',
                                    record.time_fell_asleep || 'N/A'
                                ]),
                                theme: 'grid',
                                headStyles: { fillColor: [189, 227, 195], textColor: [76, 175, 80], fontStyle: 'bold' },
                                styles: { fontSize: 10 },
                                margin: { left: 15, right: 15 }
                            });
                            yPosition = doc.lastAutoTable.finalY + 10;
                        }
                        break;

                    case 'meds':
                        if (result.data && result.data.length > 0) {
                            doc.setFontSize(14);
                            doc.setTextColor(76, 175, 80);
                            doc.setFont(undefined, 'bold');
                            doc.text('Medications', 15, yPosition);
                            yPosition += 8;

                            autoTable(doc, {
                                startY: yPosition,
                                head: [['Date', 'Medication', 'Dosage', 'Time Taken', 'Symptoms']],
                                body: result.data.map(record => [
                                    formatDate(record.date) || 'N/A',
                                    record.medication_name || 'N/A',
                                    record.dosage || 'N/A',
                                    record.time_taken || 'N/A',
                                    record.symptoms || 'N/A'
                                ]),
                                theme: 'grid',
                                headStyles: { fillColor: [189, 227, 195], textColor: [76, 175, 80], fontStyle: 'bold' },
                                styles: { fontSize: 9, cellPadding: 2 },
                                margin: { left: 15, right: 15 }
                            });
                            yPosition = doc.lastAutoTable.finalY + 10;
                        }
                        break;

                    case 'allergies':
                        if (result.data && result.data.length > 0) {
                            doc.setFontSize(14);
                            doc.setTextColor(76, 175, 80);
                            doc.setFont(undefined, 'bold');
                            doc.text('Allergies', 15, yPosition);
                            yPosition += 8;

                            autoTable(doc, {
                                startY: yPosition,
                                head: [['Allergy', 'Severity', 'EpiPen', 'Notes']],
                                body: result.data.map(record => [
                                    record.allergy_name || 'N/A',
                                    record.severity || 'N/A',
                                    record.epi_pen || 'N/A',
                                    record.notes || 'N/A'
                                ]),
                                theme: 'grid',
                                headStyles: { fillColor: [189, 227, 195], textColor: [76, 175, 80], fontStyle: 'bold' },
                                styles: { fontSize: 10 },
                                margin: { left: 15, right: 15 }
                            });
                            yPosition = doc.lastAutoTable.finalY + 10;
                        }
                        break;

                    case 'vaccinations':
                        if (result.data && result.data.length > 0) {
                            doc.setFontSize(14);
                            doc.setTextColor(76, 175, 80);
                            doc.setFont(undefined, 'bold');
                            doc.text('Vaccinations', 15, yPosition);
                            yPosition += 8;

                            autoTable(doc, {
                                startY: yPosition,
                                head: [['Vaccination', 'Date Administered']],
                                body: result.data.map(record => [
                                    record.vaccination_name || 'N/A',
                                    formatDate(record.date_of_vaccine) || 'N/A'
                                ]),
                                theme: 'grid',
                                headStyles: { fillColor: [189, 227, 195], textColor: [76, 175, 80], fontStyle: 'bold' },
                                styles: { fontSize: 10 },
                                margin: { left: 15, right: 15 }
                            });
                            yPosition = doc.lastAutoTable.finalY + 10;
                        }
                        break;

                    case 'feeding':
                        if (result.data && result.data.length > 0) {
                            doc.setFontSize(14);
                            doc.setTextColor(76, 175, 80);
                            doc.setFont(undefined, 'bold');
                            doc.text('Feeding Notes', 15, yPosition);
                            yPosition += 8;

                            autoTable(doc, {
                                startY: yPosition,
                                head: [['Date', 'Time', 'Fed From', 'Food Type', 'Amount', 'Notes']],
                                body: result.data.map(record => [
                                    formatDate(record.date) || 'N/A',
                                    record.time_fed || 'N/A',
                                    record.fed_from || 'N/A',
                                    record.type_of_food || 'N/A',
                                    record.amount || 'N/A',
                                    record.notes || 'N/A'
                                ]),
                                theme: 'grid',
                                headStyles: { fillColor: [189, 227, 195], textColor: [76, 175, 80], fontStyle: 'bold' },
                                styles: { fontSize: 8, cellPadding: 2 },
                                margin: { left: 15, right: 15 }
                            });
                            yPosition = doc.lastAutoTable.finalY + 10;
                        }
                        break;

                    case 'observation':
                        if (result.data && result.data.length > 0) {
                            doc.setFontSize(14);
                            doc.setTextColor(76, 175, 80);
                            doc.setFont(undefined, 'bold');
                            doc.text('Observation Notes', 15, yPosition);
                            yPosition += 8;

                            autoTable(doc, {
                                startY: yPosition,
                                head: [['Priority Level', 'Notes']],
                                body: result.data.map(record => [
                                    record.priority_level ? record.priority_level.toUpperCase() : 'N/A',
                                    record.notes || 'N/A'
                                ]),
                                theme: 'grid',
                                headStyles: { fillColor: [189, 227, 195], textColor: [76, 175, 80], fontStyle: 'bold' },
                                styles: { fontSize: 10 },
                                margin: { left: 15, right: 15 },
                                columnStyles: {
                                    0: { cellWidth: 40 },
                                    1: { cellWidth: 'auto' }
                                }
                            });
                            yPosition = doc.lastAutoTable.finalY + 10;
                        }
                        break;
                }
            });

            // Footer on last page
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(150, 150, 150);
                doc.text(
                    `Page ${i} of ${pageCount} | Generated by ParentPal | ${new Date().toLocaleString()}`,
                    pageWidth / 2,
                    doc.internal.pageSize.getHeight() - 10,
                    { align: 'center' }
                );
            }

            // Save PDF
            const fileName = `${baby.first_name}_${baby.last_name}_Report_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`;
            doc.save(fileName);

        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setGenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="settings-container">
                <div className="header">
                    <div className="headerContainer">
                        <Button
                            isIconOnly
                            variant="light"
                            onPress={() => navigate("/settings")}
                            className="back-button-header"
                        >
                            <ArrowLeftIcon className="w-6 h-6" />
                        </Button>
                        <Image
                            alt="Parent Pal Logo"
                            src="/images/ParentPal.png"
                            width={80}
                            className="logo"
                        />
                        <FiBell className="notification" />
                    </div>
                    <div className="headerTitle">
                        <h1>Data Export</h1>
                    </div>
                </div>
                <div className="settings-content">
                    <p>Loading...</p>
                </div>
                <Navbar />
            </div>
        );
    }

    return (
        <div className="settings-container">
            <div className="header">
                <div className="headerContainer">
                    <Button
                        isIconOnly
                        variant="light"
                        onPress={() => navigate("/settings")}
                        className="back-button-header"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </Button>
                    <Image
                        alt="Parent Pal Logo"
                        src="/images/ParentPal.png"
                        width={80}
                        className="logo"
                    />
                    <FiBell className="notification" />
                </div>
                <div className="headerTitle">
                    <h1>Data Export</h1>
                </div>
            </div>

            <div className="settings-content data-export-content">
                {babies.length === 0 ? (
                    <p>No babies found. Please add a baby to export data.</p>
                ) : (
                    <>
                        <div className="baby-selection-section">
                            <h2>Select Baby</h2>
                            <div className="form-field">
                                <Select
                                    options={babies.map(baby => ({
                                        value: baby.baby_id,
                                        label: `${baby.first_name} ${baby.last_name}`
                                    }))}
                                    value={selectedBaby}
                                    onChange={(option) => setSelectedBaby(option)}
                                    placeholder="Choose baby for export"
                                />
                            </div>
                        </div>

                        <div className="export-options-section">
                            <h2>Select Data to Export</h2>
                            <Card className="export-options-card" shadow="sm">
                                <div className="export-card-content">
                                    <Button
                                        color="primary"
                                        size="lg"
                                        onPress={generatePDF}
                                        isLoading={generating}
                                        startContent={!generating && <DocumentArrowDownIcon className="w-5 h-5" />}
                                        className="generate-pdf-button"
                                    >
                                        {generating ? "Generating PDF..." : "Generate PDF"}
                                    </Button>

                                    <div className="export-checkboxes">
                                        <Checkbox
                                            isSelected={exportOptions.growthCharts}
                                            onValueChange={() => handleCheckboxChange('growthCharts')}
                                            color="success"
                                            size="lg"
                                        >
                                            <span className="export-option-label">Growth Charts</span>
                                        </Checkbox>

                                        <Checkbox
                                            isSelected={exportOptions.sleepAnalytics}
                                            onValueChange={() => handleCheckboxChange('sleepAnalytics')}
                                            color="success"
                                            size="lg"
                                        >
                                            <span className="export-option-label">Sleep Analytics</span>
                                        </Checkbox>

                                        <Checkbox
                                            isSelected={exportOptions.medications}
                                            onValueChange={() => handleCheckboxChange('medications')}
                                            color="success"
                                            size="lg"
                                        >
                                            <span className="export-option-label">Medications</span>
                                        </Checkbox>

                                        <Checkbox
                                            isSelected={exportOptions.allergies}
                                            onValueChange={() => handleCheckboxChange('allergies')}
                                            color="success"
                                            size="lg"
                                        >
                                            <span className="export-option-label">Allergies</span>
                                        </Checkbox>

                                        <Checkbox
                                            isSelected={exportOptions.vaccinations}
                                            onValueChange={() => handleCheckboxChange('vaccinations')}
                                            color="success"
                                            size="lg"
                                        >
                                            <span className="export-option-label">Vaccinations</span>
                                        </Checkbox>

                                        <Checkbox
                                            isSelected={exportOptions.feedingNotes}
                                            onValueChange={() => handleCheckboxChange('feedingNotes')}
                                            color="success"
                                            size="lg"
                                        >
                                            <span className="export-option-label">Feeding Notes</span>
                                        </Checkbox>

                                        <Checkbox
                                            isSelected={exportOptions.observationNotes}
                                            onValueChange={() => handleCheckboxChange('observationNotes')}
                                            color="success"
                                            size="lg"
                                        >
                                            <span className="export-option-label">Observation Notes</span>
                                        </Checkbox>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </>
                )}
            </div>

            <Navbar />
        </div>
    );
}