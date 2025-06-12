// Sample student data for the demo
const sampleStudents = {
    'computer-science': [
        {
            name: 'Sarah Chen',
            year: '2',
            campus: 'clifton',
            bio: 'Looking for Python study group. Can help with web development.',
            interests: ['Python', 'Web Development', 'Gaming Society', 'Photography'],
            goals: ['study', 'skills', 'societies']
        },
        {
            name: 'Jake Morrison',
            year: '2', 
            campus: 'clifton',
            bio: 'Struggling with algorithms. Great at JavaScript and guitar.',
            interests: ['JavaScript', 'Music', 'Algorithms', 'Gaming'],
            goals: ['study', 'skills']
        },
        {
            name: 'Maya Patel',
            year: '2',
            campus: 'city',
            bio: 'Computer Science student interested in Python and AI. Looking for study partners.',
            interests: ['Python', 'Artificial Intelligence', 'Data Science', 'Tech Society'],
            goals: ['study', 'skills', 'societies']
        }
    ],
    'business': [
        {
            name: 'Emma Rodriguez',
            year: '3',
            campus: 'city',
            bio: 'Final year Business student. Can help with presentations and marketing.',
            interests: ['Marketing', 'Public Speaking', 'Entrepreneurship Society', 'Spanish'],
            goals: ['study', 'societies', 'skills']
        },
        {
            name: 'Tom Wilson',
            year: '2',
            campus: 'city',
            bio: 'Business student focusing on digital marketing. Can teach social media strategies.',
            interests: ['Digital Marketing', 'Social Media', 'Business Network', 'Football'],
            goals: ['study', 'skills']
        }
    ],
    'psychology': [
        {
            name: 'David Kim',
            year: '2',
            campus: 'clifton',
            bio: 'Psychology student interested in research methods. Plays football.',
            interests: ['Research Methods', 'Statistics', 'Football', 'Mental Health'],
            goals: ['study', 'societies']
        },
        {
            name: 'Lisa Chen',
            year: '2',
            campus: 'city',
            bio: 'Psychology student passionate about mental health advocacy and peer support.',
            interests: ['Mental Health', 'Counseling', 'Psychology Society', 'Yoga'],
            goals: ['study', 'societies', 'skills']
        }
    ]
};

function generateMatches() {
    const form = document.getElementById('connectionForm');
    const formData = new FormData(form);
    
    const course = formData.get('course');
    const year = formData.get('year');
    const campus = formData.get('campus');
    const goals = formData.getAll('goals');
    const interests = formData.get('interests').toLowerCase();
    
    if (!course || !year || !campus || goals.length === 0) {
        alert('Please fill in all required fields and select at least one goal.');
        return;
    }
    
    const resultsDiv = document.getElementById('results');
    const matchesContainer = document.getElementById('matchesContainer');
    
    // Get all potential matches
    let allMatches = [];
    
    // Add matches from same course
    if (sampleStudents[course]) {
        allMatches = allMatches.concat(sampleStudents[course]);
    }
    
    // Add cross-course matches based on interests
    if (interests.includes('programming') || interests.includes('coding') || interests.includes('python') || interests.includes('javascript')) {
        allMatches = allMatches.concat(sampleStudents['computer-science'] || []);
    }
    if (interests.includes('business') || interests.includes('marketing') || interests.includes('entrepreneurship')) {
        allMatches = allMatches.concat(sampleStudents['business'] || []);
    }
    if (interests.includes('psychology') || interests.includes('research') || interests.includes('mental health')) {
        allMatches = allMatches.concat(sampleStudents['psychology'] || []);
    }
    
    // Remove duplicates
    const uniqueMatches = allMatches.filter((student, index, self) => 
        index === self.findIndex(s => s.name === student.name)
    );
    
    // Filter and create match cards with more flexible matching
    matchesContainer.innerHTML = '';
    let exactMatches = [];
    let nearbyMatches = [];
    
    uniqueMatches.forEach(student => {
        // Check for interest overlap
        const hasCommonInterests = student.interests.some(interest => 
            interests.includes(interest.toLowerCase())
        );
        
        // Same campus and year (exact match)
        if (student.year === year && student.campus === campus) {
            exactMatches.push(student);
        }
        // Same campus, different year OR different campus, same year (close match)
        else if ((student.campus === campus) || (student.year === year) || hasCommonInterests) {
            nearbyMatches.push(student);
        }
    });
    
    // Show exact matches first
    exactMatches.forEach(student => {
        const matchCard = createMatchCard(student, goals, interests, 'exact');
        matchesContainer.appendChild(matchCard);
    });
    
    // Then show nearby matches (limit to 2 to avoid overwhelming)
    nearbyMatches.slice(0, 2).forEach(student => {
        const matchCard = createMatchCard(student, goals, interests, 'nearby');
        matchesContainer.appendChild(matchCard);
    });
    
    // If no matches at all, show general suggestions
    if (exactMatches.length === 0 && nearbyMatches.length === 0) {
        const generalMatch = createGeneralMatch(course, goals);
        matchesContainer.appendChild(generalMatch);
    }
    
    // Show results with smooth scroll
    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
    
    // Update button text
    document.getElementById('findMatchesBtn').textContent = 'Find More Connections';
}

function createMatchCard(student, userGoals, userInterests, matchType = 'exact') {
    const card = document.createElement('div');
    card.className = 'match-card';
    
    const matchReasons = [];
    if (userGoals.includes('study')) matchReasons.push('Study Partner');
    if (userGoals.includes('skills')) matchReasons.push('Skills Exchange');
    if (userGoals.includes('societies')) matchReasons.push('Society Match');
    
    const commonInterests = student.interests.filter(interest => 
        userInterests.includes(interest.toLowerCase())
    );
    
    // Add match type indicator
    let matchTypeText = '';
    if (matchType === 'nearby') {
        matchTypeText = '<small style="color: #666;">📍 Different campus or year - worth connecting!</small><br>';
    }
    
    card.innerHTML = `
        <h4>${student.name}</h4>
        ${matchTypeText}
        <p>${student.bio}</p>
        <div class="match-tags">
            ${matchReasons.map(reason => 
                `<span class="tag ${reason.toLowerCase().includes('study') ? 'study' : 
                                     reason.toLowerCase().includes('skills') ? 'skill' : 'society'}">${reason}</span>`
            ).join('')}
            ${student.interests.slice(0, 3).map(interest => 
                `<span class="tag">${interest}</span>`
            ).join('')}
        </div>
    `;
    
    return card;
}

function createGeneralMatch(course, goals) {
    const card = document.createElement('div');
    card.className = 'match-card';
    
    const suggestions = {
        'computer-science': 'Join the Computing Society study groups and coding workshops',
        'business': 'Connect with Entrepreneurship Society and Business Network events',
        'psychology': 'Explore Psychology Society research groups and peer support'
    };
    
    card.innerHTML = `
        <h4>Great news! We found opportunities for you</h4>
        <p>${suggestions[course] || 'We\'ll help you find the perfect study community for your course.'}</p>
        <p><strong>Next steps:</strong> Complete your full profile to get personalized matches with fellow students.</p>
        <div class="match-tags">
            ${goals.map(goal => 
                `<span class="tag ${goal === 'study' ? 'study' : goal === 'skills' ? 'skill' : 'society'}">${
                    goal === 'study' ? 'Study Groups' : 
                    goal === 'skills' ? 'Skills Exchange' : 'Societies'
                }</span>`
            ).join('')}
        </div>
    `;
    
    return card;
}

// Smooth scrolling for demo button
document.querySelector('a[href="#demo"]').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('demo').scrollIntoView({ 
        behavior: 'smooth' 
    });
});

// Form validation and accessibility
document.getElementById('connectionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    generateMatches();
});

// Keyboard accessibility for custom buttons
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.classList.contains('cta-button')) {
        e.target.click();
    }
});