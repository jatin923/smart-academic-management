// Student data storage
let students = [];

// Subject mappings for different classes
const subjectMap = {
    'UKG': ['English', 'Hindi'],
    'Class I': ['English', 'Hindi', 'Math'],
    'class II': ['English', 'Hindi', 'Math'],
    'class III': ['English', 'Hindi', 'Math'],
    'class IV': ['English', 'Hindi', 'Math'],
    'class V': ['English', 'Hindi', 'Math'],
    'Class VI': ['English', 'Hindi', 'Science', 'Political Science', 'Math','sanskrit', 'punjabi', 'urdu'] ,
    'Class VII': ['English', 'Hindi', 'Science', 'Political Science', 'Math','sanskrit', 'punjabi', 'urdu'],
    'Class VIII': ['English', 'Hindi', 'Science', 'Political Science', 'Math','sanskrit', 'punjabi', 'urdu'],
    'Class IX': ['English', 'Hindi', 'Science', 'Political Science', 'Math','sanskrit', 'punjabi', 'urdu'],
    'Class X': ['English', 'Hindi', 'Science', 'Political Science', 'Math', 'sanskrit', 'punjabi', 'urdu'],
    'Class XI Arts': ['History', 'Political Science', 'Geography', 'Sociology', 'Hindi', 'English', 'Economics'],
    'Class XI Commerce': ['Math', 'Economics', 'English', 'Hindi', 'Business Studies', 'Physical Education'],
    'Class XI Science PCB': ['Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Home Science'],
    'Class XI Science PCM': ['Physics', 'Chemistry', 'Math', 'English', 'Hindi'],
    'Class XII Arts': ['History', 'Political Science', 'Geography', 'Sociology', 'Hindi', 'English', 'Economics'],
    'Class XII Commerce': ['Math', 'Economics', 'English', 'Hindi', 'Business Studies', 'Physical Education'],
    'Class XII Science PCB': ['Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Home Science'],
    'Class XII Science PCM': ['Physics', 'Chemistry', 'Math', 'English', 'Hindi']
};

// Load data from localStorage on page load
document.addEventListener('DOMContentLoaded', function() {
    loadFromStorage();
    updateStats();
    renderStudents();
    renderAnalytics();
});

// Load students from localStorage
function loadFromStorage() {
    const data = localStorage.getItem('students');
    if (data) {
        students = JSON.parse(data);
    }
}

// Save students to localStorage
function saveToStorage() {
    localStorage.setItem('students', JSON.stringify(students));
}

// Update subjects based on selected class
function updateSubjects() {
    const className = document.getElementById('class').value;
    const container = document.getElementById('subjectsContainer');
    
    if (!className) {
        container.innerHTML = '';
        return;
    }
    
    const subjects = subjectMap[className] || [];
    container.innerHTML = subjects.map(subject => `
        <div class="subject-input-group">
            <label>${subject} (0-100)</label>
            <input type="number" class="subject-marks" data-subject="${subject}" 
                   min="0" max="100" step="0.01" onchange="calculateTotal()">
        </div>
    `).join('');
    
    calculateTotal();
}

// Calculate total and percentage
function calculateTotal() {
    const inputs = document.querySelectorAll('.subject-marks');
    let total = 0;
    let count = 0;
    
    inputs.forEach(input => {
        const value = parseFloat(input.value) || 0;
        if (value > 0) {
            total += value;
            count++;
        }
    });
    
    const percentage = count > 0 ? (total / count).toFixed(2) : 0;
    document.getElementById('totalMarks').value = total.toFixed(2);
    document.getElementById('percentage').value = percentage;
}

// Show specific section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Update relevant sections when switching
    if (sectionId === 'view') {
        renderStudents();
    } else if (sectionId === 'analytics') {
        renderAnalytics();
    }
}

// Add student
function addStudent(event) {
    event.preventDefault();
    
    const roll = parseInt(document.getElementById('roll').value);
    const name = document.getElementById('name').value;
    const className = document.getElementById('class').value;
    const percentage = parseFloat(document.getElementById('percentage').value);
    
    // Check if roll number already exists
    if (students.some(s => s.roll === roll)) {
        alert('Student with this roll number already exists!');
        return;
    }
    
    // Collect subject marks
    const subjects = {};
    const inputs = document.querySelectorAll('.subject-marks');
    inputs.forEach(input => {
        const subject = input.getAttribute('data-subject');
        const marks = parseFloat(input.value) || 0;
        subjects[subject] = marks;
    });
    
    const student = {
        roll: roll,
        name: name,
        class: className,
        subjects: subjects,
        percentage: percentage
    };
    
    students.push(student);
    saveToStorage();
    updateStats();
    
    // Show success message
    showSuccessMessage('Student added successfully!');
    
    // Reset form
    document.getElementById('addForm').reset();
    document.getElementById('subjectsContainer').innerHTML = '';
    document.getElementById('totalMarks').value = '';
    document.getElementById('percentage').value = '';
    
    // Switch to view section to show the new student
    setTimeout(() => {
        document.querySelectorAll('.menu-btn').forEach(btn => {
            if (btn.textContent.includes('View All')) {
                btn.click();
            }
        });
    }, 500);
}

// Render all students
function renderStudents(filteredStudents = null) {
    const container = document.getElementById('studentsList');
    const studentsToShow = filteredStudents || students;
    
    if (studentsToShow.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>No students found</h3><p>Add some students to get started!</p></div>';
        return;
    }
    
    container.innerHTML = studentsToShow.map(student => {
        const percentage = student.percentage || (student.marks || 0);
        const className = student.class || 'N/A';
        
        // Create subjects HTML
        let subjectsHTML = '';
        if (student.subjects) {
            subjectsHTML = '<div style="margin-top: 10px; font-size: 0.9em;">';
            Object.keys(student.subjects).forEach(subject => {
                subjectsHTML += `<p style="margin: 5px 0;"><strong>${subject}:</strong> ${student.subjects[subject].toFixed(2)}</p>`;
            });
            subjectsHTML += '</div>';
        }
        
        return `
            <div class="student-card">
                <h3>${student.name}</h3>
                <p><strong>Roll No:</strong> ${student.roll}</p>
                <p><strong>Class:</strong> ${className}</p>
                ${subjectsHTML}
                <p style="margin-top: 10px;"><strong>Percentage:</strong> ${percentage.toFixed(2)}%</p>
                <span class="grade grade-${getGradeClass(percentage)}">${predictGrade(percentage)}</span>
                <div class="recommendation">${getRecommendation(percentage)}</div>
                <button onclick="deleteStudent(${student.roll})" class="btn btn-danger" style="width: 100%; margin-top: 10px;">Delete</button>
            </div>
        `;
    }).join('');
}

// Search in view section
function searchInView(query) {
    if (!query) {
        renderStudents();
        return;
    }
    
    const filtered = students.filter(student => 
        student.name.toLowerCase().includes(query.toLowerCase())
    );
    renderStudents(filtered);
}

// Search by roll number
function searchByRoll() {
    const roll = parseInt(document.getElementById('searchRoll').value);
    const container = document.getElementById('searchResults');
    
    if (!roll) {
        container.innerHTML = '<div class="empty-state"><h3>Please enter a roll number</h3></div>';
        return;
    }
    
    const student = students.find(s => s.roll === roll);
    
    if (student) {
        const percentage = student.percentage || (student.marks || 0);
        const className = student.class || 'N/A';
        
        // Create subjects HTML
        let subjectsHTML = '';
        if (student.subjects) {
            subjectsHTML = '<div style="margin-top: 10px; font-size: 0.9em;">';
            Object.keys(student.subjects).forEach(subject => {
                subjectsHTML += `<p style="margin: 5px 0;"><strong>${subject}:</strong> ${student.subjects[subject].toFixed(2)}</p>`;
            });
            subjectsHTML += '</div>';
        }
        
        container.innerHTML = `
            <div class="student-card">
                <h3>${student.name}</h3>
                <p><strong>Roll No:</strong> ${student.roll}</p>
                <p><strong>Class:</strong> ${className}</p>
                ${subjectsHTML}
                <p style="margin-top: 10px;"><strong>Percentage:</strong> ${percentage.toFixed(2)}%</p>
                <span class="grade grade-${getGradeClass(percentage)}">${predictGrade(percentage)}</span>
                <div class="recommendation">${getRecommendation(percentage)}</div>
                <p style="margin-top: 10px;"><strong>AI Prediction:</strong> ${predictPass(percentage) ? '✅ Will Pass' : '❌ Will Fail'}</p>
            </div>
        `;
    } else {
        container.innerHTML = '<div class="empty-state"><h3>Student not found!</h3></div>';
    }
}

// Delete student
function deleteStudent(roll) {
    if (confirm('Are you sure you want to delete this student?')) {
        students = students.filter(s => s.roll !== roll);
        saveToStorage();
        updateStats();
        renderStudents();
        renderAnalytics();
    }
}

// Predict grade
function predictGrade(marks) {
    if (marks >= 90) return "A+";
    else if (marks >= 80) return "A";
    else if (marks >= 70) return "B";
    else if (marks >= 60) return "C";
    else if (marks >= 50) return "D";
    else return "F";
}

// Get grade CSS class
function getGradeClass(marks) {
    if (marks >= 90) return "A+";
    else if (marks >= 80) return "A";
    else if (marks >= 70) return "B";
    else if (marks >= 60) return "C";
    else if (marks >= 50) return "D";
    else return "F";
}

// Get recommendation
function getRecommendation(marks) {
    if (marks < 50) return "💡 Recommendation: Focus more on basics and seek help from teachers.";
    else if (marks < 70) return "💡 Recommendation: Practice more advanced problems to improve.";
    else return "💡 Recommendation: Keep up the excellent work!";
}

// Predict pass/fail
function predictPass(marks) {
    return marks >= 50;
}

// Update statistics
function updateStats() {
    document.getElementById('totalStudents').textContent = students.length;
    
    if (students.length === 0) {
        document.getElementById('avgMarks').textContent = '0.00';
        document.getElementById('passRate').textContent = '0%';
        return;
    }
    
    const totalPercentage = students.reduce((sum, s) => {
        const percentage = s.percentage || (s.marks || 0);
        return sum + percentage;
    }, 0);
    const average = totalPercentage / students.length;
    document.getElementById('avgMarks').textContent = average.toFixed(2);
    
    const passed = students.filter(s => {
        const percentage = s.percentage || (s.marks || 0);
        return percentage >= 50;
    }).length;
    const passRate = (passed / students.length) * 100;
    document.getElementById('passRate').textContent = passRate.toFixed(0) + '%';
}

// Render analytics
function renderAnalytics() {
    renderGradeDistribution();
    renderTopPerformers();
    renderNeedsAttention();
    renderAIRecommendations();
}

// Render grade distribution
function renderGradeDistribution() {
    const canvas = document.getElementById('gradeChart');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 300;
    canvas.height = 300;
    
    if (students.length === 0) {
        ctx.fillStyle = '#999';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No data available', canvas.width / 2, canvas.height / 2);
        return;
    }
    
    // Count grades
    const gradeCount = {
        'A+': 0, 'A': 0, 'B': 0, 'C': 0, 'D': 0, 'F': 0
    };
    
    students.forEach(s => {
        const percentage = s.percentage || (s.marks || 0);
        const grade = predictGrade(percentage);
        gradeCount[grade]++;
    });
    
    // Draw pie chart
    const colors = {
        'A+': '#27ae60', 'A': '#2ecc71', 'B': '#3498db',
        'C': '#f39c12', 'D': '#e67e22', 'F': '#e74c3c'
    };
    
    let startAngle = 0;
    const total = students.length;
    
    Object.keys(gradeCount).forEach(grade => {
        const count = gradeCount[grade];
        if (count > 0) {
            const sliceAngle = (count / total) * 2 * Math.PI;
            
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, canvas.height / 2);
            ctx.arc(canvas.width / 2, canvas.height / 2, 120, startAngle, startAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = colors[grade];
            ctx.fill();
            
            // Label
            const labelAngle = startAngle + sliceAngle / 2;
            const labelX = canvas.width / 2 + Math.cos(labelAngle) * 140;
            const labelY = canvas.height / 2 + Math.sin(labelAngle) * 140;
            ctx.fillStyle = colors[grade];
            ctx.font = 'bold 14px Arial';
            ctx.fillText(`${grade}: ${count}`, labelX, labelY);
            
            startAngle += sliceAngle;
        }
    });
}

// Render top performers
function renderTopPerformers() {
    const container = document.getElementById('topPerformers');
    
    if (students.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No students yet</p></div>';
        return;
    }
    
    const top3 = [...students]
        .sort((a, b) => {
            const aPercent = a.percentage || (a.marks || 0);
            const bPercent = b.percentage || (b.marks || 0);
            return bPercent - aPercent;
        })
        .slice(0, 3);
    
    container.innerHTML = top3.map((s, index) => {
        const percentage = s.percentage || (s.marks || 0);
        return `
            <div class="top-student">
                <h4>🏆 Rank ${index + 1}: ${s.name}</h4>
                <p>Roll: ${s.roll} | Percentage: ${percentage.toFixed(2)}% | Grade: ${predictGrade(percentage)}</p>
            </div>
        `;
    }).join('');
}

// Render needs attention
function renderNeedsAttention() {
    const container = document.getElementById('needsAttention');
    
    const needsHelp = students.filter(s => {
        const percentage = s.percentage || (s.marks || 0);
        return percentage < 50;
    });
    
    if (needsHelp.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>✅ All students are performing well!</p></div>';
        return;
    }
    
    container.innerHTML = needsHelp.map(s => {
        const percentage = s.percentage || (s.marks || 0);
        return `
            <div class="attention-student">
                <h4>⚠️ ${s.name}</h4>
                <p>Roll: ${s.roll} | Percentage: ${percentage.toFixed(2)}% | Grade: ${predictGrade(percentage)}</p>
                <p>Action: Needs immediate assistance</p>
            </div>
        `;
    }).join('');
}

// Render AI recommendations
function renderAIRecommendations() {
    const container = document.getElementById('aiRecommendations');
    
    if (students.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Add students to get AI recommendations</p></div>';
        return;
    }
    
    const recommendations = generateAIRecommendations();
    container.innerHTML = recommendations.map(rec => `
        <div class="ai-recommendation">
            <h4>${rec.title}</h4>
            <p>${rec.message}</p>
        </div>
    `).join('');
}

// Generate AI recommendations
function generateAIRecommendations() {
    const recommendations = [];
    
    if (students.length === 0) return recommendations;
    
    // Calculate average
    const avg = students.reduce((sum, s) => {
        const percentage = s.percentage || (s.marks || 0);
        return sum + percentage;
    }, 0) / students.length;
    
    const failingCount = students.filter(s => {
        const percentage = s.percentage || (s.marks || 0);
        return percentage < 50;
    }).length;
    
    // Overall performance recommendation
    if (avg >= 80) {
        recommendations.push({
            title: '🎉 Excellent Performance!',
            message: 'Your class average is outstanding. Keep motivating students to maintain this level.'
        });
    } else if (avg >= 60) {
        recommendations.push({
            title: '📈 Good Progress',
            message: 'Class is performing well. Focus on helping struggling students reach the average.'
        });
    } else {
        recommendations.push({
            title: '⚠️ Need Improvement',
            message: 'Class average is below expectations. Consider additional tutoring and study sessions.'
        });
    }
    
    // Failing students recommendation
    if (failingCount > 0) {
        const percentage = (failingCount / students.length) * 100;
        recommendations.push({
            title: '🚨 Intervention Needed',
            message: `${failingCount} student(s) (${percentage.toFixed(0)}%) are failing. Schedule one-on-one sessions immediately.`
        });
    }
    
    // Grade distribution recommendation
    const gradeA = students.filter(s => {
        const percentage = s.percentage || (s.marks || 0);
        return percentage >= 80;
    }).length;
    const gradeB = students.filter(s => {
        const percentage = s.percentage || (s.marks || 0);
        return percentage >= 60 && percentage < 80;
    }).length;
    
    if (gradeA > gradeB + gradeB) {
        recommendations.push({
            title: '⭐ High Achievers Dominant',
            message: 'Most students are high achievers. Challenge them with advanced assignments.'
        });
    }
    
    return recommendations;
}

// Show success message
function showSuccessMessage(message) {
    const section = document.getElementById('add');
    const existingMsg = section.querySelector('.success-message');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    const msgDiv = document.createElement('div');
    msgDiv.className = 'success-message';
    msgDiv.textContent = message;
    section.insertBefore(msgDiv, section.firstChild);
    
    setTimeout(() => {
        msgDiv.remove();
    }, 3000);
}

