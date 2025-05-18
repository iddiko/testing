// 스크롤 시 헤더 스타일 변경
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    } else {
        header.style.backgroundColor = '#fff';
    }
});

// 스무스 스크롤
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// 게시판 기능
const boardData = [
    {
        id: 5,
        title: '2024년 신규 서비스 출시 안내',
        author: '관리자',
        date: '2024-03-18',
        views: 45
    },
    {
        id: 4,
        title: '시스템 정기 점검 안내',
        author: '관리자',
        date: '2024-03-15',
        views: 32
    },
    {
        id: 3,
        title: '신규 고객사 협약 체결',
        author: '관리자',
        date: '2024-03-10',
        views: 67
    },
    {
        id: 2,
        title: '채용 공고',
        author: '인사팀',
        date: '2024-03-05',
        views: 89
    },
    {
        id: 1,
        title: '홈페이지 리뉴얼 안내',
        author: '관리자',
        date: '2024-03-01',
        views: 120
    }
];

let currentPage = 1;
const postsPerPage = 5;

// 게시글 목록 표시
function displayBoardPosts() {
    const boardList = document.getElementById('boardList');
    if (!boardList) return;

    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    const pageData = boardData.slice(start, end);

    boardList.innerHTML = pageData.map(post => `
        <tr>
            <td>${post.id}</td>
            <td>${post.title}</td>
            <td>${post.author}</td>
            <td>${post.date}</td>
            <td>${post.views}</td>
        </tr>
    `).join('');
}

// 페이지 이동 버튼 이벤트
document.getElementById('prevPage')?.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayBoardPosts();
        updatePageNumber();
    }
});

document.getElementById('nextPage')?.addEventListener('click', () => {
    if (currentPage * postsPerPage < boardData.length) {
        currentPage++;
        displayBoardPosts();
        updatePageNumber();
    }
});

// 페이지 번호 업데이트
function updatePageNumber() {
    const pageNumber = document.getElementById('currentPage');
    if (pageNumber) {
        pageNumber.textContent = currentPage;
    }
}

// 글쓰기 버튼 이벤트
document.getElementById('writeButton')?.addEventListener('click', () => {
    alert('로그인이 필요한 서비스입니다.');
});

// 초기 게시글 목록 표시
displayBoardPosts();

// API 엔드포인트
const API_URL = 'http://localhost:5000/api';

// 인증 관련 함수들
const auth = {
    token: localStorage.getItem('token'),
    user: JSON.parse(localStorage.getItem('user')),

    isAuthenticated() {
        return !!this.token;
    },

    setAuth(token, user) {
        this.token = token;
        this.user = user;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.updateUI();
    },

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.updateUI();
    },

    updateUI() {
        const loginButton = document.getElementById('loginButton');
        if (this.isAuthenticated()) {
            loginButton.textContent = this.user.username;
            loginButton.onclick = () => this.logout();
        } else {
            loginButton.textContent = '로그인';
            loginButton.onclick = () => showModal('loginModal');
        }
    }
};

// 모달 관련 함수들
function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function hideModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// 모달 이벤트 리스너
document.querySelectorAll('.modal .close').forEach(closeBtn => {
    closeBtn.onclick = () => {
        closeBtn.closest('.modal').style.display = 'none';
    };
});

document.getElementById('showRegister').onclick = () => {
    hideModal('loginModal');
    showModal('registerModal');
};

document.getElementById('showLogin').onclick = () => {
    hideModal('registerModal');
    showModal('loginModal');
};

// 폼 제출 처리
document.getElementById('loginForm').onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (response.ok) {
            auth.setAuth(data.token, data.user);
            hideModal('loginModal');
            alert('로그인되었습니다.');
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('로그인 중 오류가 발생했습니다.');
    }
};

document.getElementById('registerForm').onsubmit = async (e) => {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert('회원가입이 완료되었습니다. 로그인해주세요.');
            hideModal('registerModal');
            showModal('loginModal');
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('회원가입 중 오류가 발생했습니다.');
    }
};

// 게시판 관련 함수들
async function loadPosts(page = 1) {
    try {
        const response = await fetch(`${API_URL}/board?page=${page}`);
        const data = await response.json();
        
        const boardList = document.getElementById('boardList');
        boardList.innerHTML = data.posts.map(post => `
            <tr>
                <td>${post._id}</td>
                <td><a href="#" onclick="viewPost('${post._id}')">${post.title}</a></td>
                <td>${post.author.username}</td>
                <td>${new Date(post.createdAt).toLocaleDateString()}</td>
                <td>${post.views}</td>
            </tr>
        `).join('');

        // 페이지네이션 업데이트
        document.getElementById('currentPage').textContent = data.currentPage;
        document.getElementById('prevPage').disabled = data.currentPage <= 1;
        document.getElementById('nextPage').disabled = data.currentPage >= data.totalPages;
    } catch (error) {
        console.error('게시글 로딩 중 오류:', error);
    }
}

async function viewPost(postId) {
    try {
        const response = await fetch(`${API_URL}/board/${postId}`);
        const post = await response.json();
        
        // 여기에 게시글 상세 보기 모달 표시 로직 추가
        alert(`
            제목: ${post.title}
            작성자: ${post.author.username}
            내용: ${post.content}
            조회수: ${post.views}
            작성일: ${new Date(post.createdAt).toLocaleDateString()}
        `);
    } catch (error) {
        console.error('게시글 조회 중 오류:', error);
    }
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    auth.updateUI();
    loadPosts();
}); 