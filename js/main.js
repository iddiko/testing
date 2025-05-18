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