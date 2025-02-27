export async function renderAbsenceReasonChart(){
    const absenceReasonCanvas = document.getElementById("absence-reason-content-canvas")

    const response = await window.api.db.absence.getDataToAbsenceReasonChart()

    if (response.status === true) {
        const reasons = response.data

        const labels = reasons.map(item => item.reason) 
        const data = reasons.map(item => item.quantity)  

        new Chart(absenceReasonCanvas, {
            type: 'pie',
            data: {
                labels: labels, 
                datasets: [{
                    label: 'Quantidade de Ausências',   
                    data: data,  
                    backgroundColor: ["#f07b8b", "#f5a1c1", "#f5a36d", "#6da9e1", "#f7e24e", "#c78ee3", "#f5a79f", "#b1e7a1"],
                    hoverBackgroundColor: ["#f07b8b", "#f5a1c1", "#f5a36d", "#6da9e1", "#f7e24e", "#c78ee3", "#f5a79f", "#b1e7a1"]                    
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                const percentage = tooltipItem.raw / data.reduce((a, b) => a + b, 0) * 100
                                return `${tooltipItem.label}: ${tooltipItem.raw} ausências (${percentage.toFixed(2)}%)`
                            }
                        }
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            boxWidth: 12
                        }
                    },
                    title: {
                        display: false,
                    }
                }
            }
        })
    }
}

export async function renderGradeChart(){
    const gradeCanvas = document.getElementById("grade-content-canvas")

    const response = await window.api.db.grade.getDataToGradeChart()

    if (response.status === true) {
        const grades = response.data

        const labels = grades.map(item => item.name) 
        const totalGrades = grades.map(item => item.total_grades)  
        const minGrades = grades.map(item => item.min_grade)
        const maxGrades = grades.map(item => item.max_grade)

        const barColors = grades.map(item => {
            if (item.total_grades >= item.max_grade) {
                return '#4CAF50' 
            } else if (item.total_grades < item.min_grade) {
                return '#f44336'
            } else {
                return '#2196F3'
            }
        })

        new Chart(gradeCanvas, {
            type: 'bar', 
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total de Notas',
                    data: totalGrades,
                    backgroundColor: barColors, 
                    borderColor: '#000',
                    borderWidth: 1,
                    barThickness: 20
                }]
            },
            options: {
                responsive: true,
                indexAxis: 'y', 
                scales: {
                    x: {
                        beginAtZero: true,
                        max: Math.max(...maxGrades), 
                    },
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                const percentage = tooltipItem.raw / maxGrades[tooltipItem.dataIndex] * 100
                                return `${tooltipItem.label}: ${tooltipItem.raw} (${percentage.toFixed(2)}%)`
                            }
                        }
                    },
                    legend: {
                        display: false
                    }
                }
            }
        })
    }
}

export async function renderPerformanceChart() {
    const performanceCanvas = document.getElementById("performance-content-canvas")

    const response = await window.api.db.subject.getDataToPerformanceChart()

    if (response.status === true) {
        const grades = response.data
        let belowMin = 0
        let atMin = 0
        let atMax = 0

        grades.forEach(item => {
            if (item.total_grades < item.min_grade) {
                belowMin++
            } else if (item.total_grades >= item.max_grade) {
                atMax++
            } else {
                atMin++
            }
        })

        const performanceData = {
            labels: [
                `Abaixo da Mínima (${belowMin})`,
                `Acima da Mínima (${atMin})`,
                `Nota Máxima (${atMax})`
            ],
            datasets: [{
                data: [belowMin, atMin, atMax],
                backgroundColor: ["#f07b8b", "#f5a1c1", "#f5a36d"],
                hoverBackgroundColor: ["#f07b8b", "#f5a1c1", "#f5a36d"],
            }]
        }

        new Chart(performanceCanvas, {
            type: 'pie',
            data: performanceData,
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                const totalSubjects = grades.length
                                const percentage = (tooltipItem.raw / totalSubjects) * 100
                                return `${tooltipItem.label} (${percentage.toFixed(2)}%)`
                            }
                        }
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            boxWidth: 12
                        }
                    }
                }
            }
        })
    }
}

export async function renderPriorityChart() {
    const priorityCanvas = document.getElementById("priority-content-canvas")

    const response = await window.api.db.task.getDataToPriorityChart()

    if (response.status === true) {
        const taskCounts = response.data

        const labels = taskCounts.map(item => `Prioridade ${item.priority_level}`) 
        const data = taskCounts.map(item => item.task_count)  
        const colors = ["#f07b8b", "#f5a1c1", "#f5a36d", "#6da9e1", "#f7e24e", "#c78ee3", "#f5a79f", "#b1e7a1"]

        new Chart(priorityCanvas, {
            type: 'pie',
            data: {
                labels: labels, 
                datasets: [{
                    data: data,  
                    backgroundColor: colors.slice(0, data.length), 
                    borderColor: '#000',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                const totalTasks = data.reduce((a, b) => a + b, 0)
                                const percentage = tooltipItem.raw / totalTasks * 100
                                return `${tooltipItem.label}: ${tooltipItem.raw} tarefas (${percentage.toFixed(2)}%)`
                            }
                        }
                    },
                    legend: {
                        display: false,
                    },
                    title: {
                        display: false,
                    }
                }
            }
        })
    }
}

export async function renderTextSubjectChart() {
    const textSubjectQuantityCanvas = document.getElementById("text-subject-quantity-content-canvas")

    const response = await window.api.db.text.getDataToTextSubjectChart()

    if (response.status === true) {
        const subjectCounts = response.data

        const labels = subjectCounts.map(item => item.subject_name)
        const data = subjectCounts.map(item => item.text_count)
        
        const colors = [
            "#f07b8b", "#f5a1c1", "#f5a36d", "#6da9e1", "#f7e24e", "#c78ee3", "#f5a79f", "#b1e7a1", 
            "#fc77f7", "#f8f7f9", "#d6bbf2", "#ff6e6e", "#9e5ff7", "#fe875f", "#7d5a5f", "#9f8773", 
            "#f7c553", "#f593b3", "#f59d65", "#72b1b5", "#c5e6f4", "#7cd8c5", "#ff99bb", "#80cbff", 
            "#f9a7c4", "#6b6db3", "#ff4e6a", "#7dffae", "#dbfae4", "#ffdd9e"
        ]

        new Chart(textSubjectQuantityCanvas, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors.slice(0, data.length),
                    borderColor: '#000',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                const totalTexts = data.reduce((a, b) => a + b, 0)
                                const percentage = tooltipItem.raw / totalTexts * 100
                                return `${tooltipItem.label}: ${tooltipItem.raw} textos (${percentage.toFixed(2)}%)`
                            }
                        }
                    },
                    legend: {
                        position: 'top',
                        labels: {
                            boxWidth: 12
                        }
                    },
                    title: {
                        display: false,
                    }
                }
            }
        })
    }
}

export async function renderTextDistributionOverTime() {
    const textDistributionCanvas = document.getElementById("text-distribution-canvas")

    const response = await window.api.db.text.getDataToTetDistributionOverTimeChart()

    if (response.status === true) {
        const data = response.data

        const labels = data.map(item => item.date) 
        const textCounts = data.map(item => item.text_count) 

        new Chart(textDistributionCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Quantidade de Textos',
                    data: textCounts,
                    borderColor: '#4CAF50',
                    fill: false,
                    borderWidth: 2,
                    pointBackgroundColor: '#4CAF50',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'category',
                        
                        ticks: {
                            autoSkip: true,
                            maxRotation: 45,
                            minRotation: 45,
                            font: {
                                size: 10
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Quantidade',
                            font: {
                                size: 12,
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return `Textos: ${tooltipItem.raw}`
                            }
                        }
                    },
                    legend: {
                        display: false
                    }
                }
            }
        })
    }
}