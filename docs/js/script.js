// DOM 元素
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const backToTop = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');
const navLinks = document.querySelectorAll('.nav-link, #mobile-menu a');
const playerCount = document.getElementById('player-count');
const totalPlayers = document.getElementById('total-players');
const serverStatusLight = document.getElementById('server-status-light');
const serverStatusContainer = document.getElementById('server-status-container');

// 初始化函数
function init() {
    // 事件监听器
    window.addEventListener('scroll', handleScroll);
    menuToggle.addEventListener('click', toggleMobileMenu);
    backToTop.addEventListener('click', scrollToTop);
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
    
    // 模拟玩家数量
    simulatePlayerCount();
    
    // 添加淡入动画
    addFadeInAnimation();
    
    // 监听窗口大小变化
    window.addEventListener('resize', checkMobileMenu);
}

// 处理滚动事件
function handleScroll() {
    // 导航栏滚动效果
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // 返回顶部按钮显示/隐藏
    if (window.scrollY > 300) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
    
    // 检查元素是否在视口中并添加动画
    checkElementsInView();
}

// 切换移动菜单
function toggleMobileMenu() {
    mobileMenu.classList.toggle('hidden');
    // 切换图标
    const icon = menuToggle.querySelector('i');
    if (icon.classList.contains('fa-bars')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

// 检查移动菜单是否需要关闭
function checkMobileMenu() {
    if (window.innerWidth >= 768 && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

// 平滑滚动
function smoothScroll(e) {
    e.preventDefault();
    
    // 关闭移动菜单
    if (!mobileMenu.classList.contains('hidden')) {
        toggleMobileMenu();
    }
    
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        window.scrollTo({
            top: targetElement.offsetTop - 80, // 减去导航栏高度
            behavior: 'smooth'
        });
    }
}

// 滚动到顶部
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 处理表单提交
function handleFormSubmit(e) {
    e.preventDefault();
    
    // 获取表单数据
    const formData = new FormData(contactForm);
    const formValues = Object.fromEntries(formData.entries());
    
    // 在实际应用中，这里会发送数据到服务器
    console.log('表单数据:', formValues);
    
    // 显示提交成功消息
    alert('感谢您的留言！我们会尽快回复您。');
    
    // 重置表单
    contactForm.reset();
}

// 添加淡入动画
function addFadeInAnimation() {
    const fadeElements = document.querySelectorAll('.feature-card, #schedule .schedule-row, #guide .flex, #contact a, #contact form');
    
    fadeElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        element.dataset.delay = index * 100;
    });
}

// 检查元素是否在视口中
function checkElementsInView() {
    const fadeElements = document.querySelectorAll('.feature-card, #schedule .schedule-row, #guide .flex, #contact a, #contact form');
    
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, element.dataset.delay || 0);
        }
    });
}

// 模拟玩家数量
function simulatePlayerCount() {
    // 随机生成在线玩家数量 (10-50)
    const online = Math.floor(Math.random() * 41) + 10;
    // 随机生成总注册玩家数量 (50-200)
    const total = Math.floor(Math.random() * 151) + 50;
    
    // 数字增长动画
    animateNumber(playerCount, 0, online, 1500);
    animateNumber(totalPlayers, 0, total, 1500);
    
    // 每30秒更新一次
    setInterval(() => {
        const newOnline = Math.floor(Math.random() * 41) + 10;
        animateNumber(playerCount, parseInt(playerCount.innerText), newOnline, 1500);
    }, 30000);
}

// 数字增长动画
function animateNumber(element, start, end, duration) {
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        
        element.innerText = value;
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}

// 创建粒子效果
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.classList.add('particles-container');
    document.body.appendChild(particlesContainer);
    
    // 创建100个粒子
    for (let i = 0; i < 100; i++) {
        const particle = document.createElement('div');
        
        // 随机大小、位置、颜色和动画
        const size = Math.random() * 3 + 1;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const opacity = Math.random() * 0.5 + 0.1;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 10;
        
        // 随机颜色（从主题色中选择）
        const colors = ['#FF4D4D', '#3D5A80', '#F2CC8F', '#EEF5FF'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.position = 'absolute';
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = color;
        particle.style.borderRadius = '50%';
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        particle.style.opacity = opacity;
        particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
        particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
        particle.style.animationFillMode = 'both';
        particle.style.animationDirection = Math.random() > 0.5 ? 'normal' : 'reverse';
        
        particlesContainer.appendChild(particle);
    }
}

// 平滑页面加载效果
function smoothPageLoad() {
    // 页面加载完成后移除加载动画
    window.addEventListener('load', () => {
        setTimeout(() => {
            const loading = document.querySelector('.loading');
            if (loading) {
                loading.classList.add('fade-out');
                setTimeout(() => {
                    loading.style.display = 'none';
                }, 500);
            }
        }, 500);
    });
}

// 为链接添加悬停效果
function addLinkHoverEffects() {
    const links = document.querySelectorAll('a:not(.btn-primary):not(.btn-secondary)');
    
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-2px)';
            link.style.transition = 'transform 0.3s ease';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0)';
        });
    });
}

// 动态调整内容高度
function adjustContentHeight() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const windowHeight = window.innerHeight;
        const sectionHeight = section.offsetHeight;
        
        if (sectionHeight < windowHeight * 0.8) {
            section.style.minHeight = `${windowHeight * 0.8}px`;
        }
    });
}

// 监听窗口大小变化，调整内容高度
window.addEventListener('resize', adjustContentHeight);

// 初始化页面
window.addEventListener('DOMContentLoaded', () => {
    init();
    adjustContentHeight();
    addLinkHoverEffects();
    // createParticles(); // 可选：如果需要粒子效果，可以取消注释
    smoothPageLoad();
});

// 导出函数（用于调试和扩展）
window.EFTSERVER = {
    init,
    handleScroll,
    smoothScroll,
    simulatePlayerCount
};