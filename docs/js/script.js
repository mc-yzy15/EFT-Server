// 获取DOM元素
const nav = document.querySelector('nav');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const closeMenu = document.querySelector('.close-menu');
const mobileLinks = document.querySelectorAll('.mobile-menu a');
const backToTop = document.querySelector('.back-to-top');
const playerCount = document.querySelector('.player-count');
const totalPlayers = document.querySelector('.total-players');
const heroSection = document.querySelector('.hero-section');
const serverStatusLight = document.querySelector('.server-status-indicator');
const allClickableElements = document.querySelectorAll('a, button');
const parallaxElements = document.querySelectorAll('.parallax');

// 初始化函数
function init() {
    // 添加事件监听器
    menuToggle.addEventListener('click', toggleMobileMenu);
    closeMenu.addEventListener('click', toggleMobileMenu);
    window.addEventListener('scroll', handleScroll);
    backToTop.addEventListener('click', scrollToTop);
    
    // 为移动菜单链接添加点击事件
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMobileMenu();
        });
    });
    
    // 添加点击反馈动画
    addClickFeedback();
    
    // 启用元素拖动交互
    enableDraggableElements();
    
    // 添加增强的悬停效果
    addEnhancedHoverEffects();
    
    // 监听滚动事件
    window.addEventListener('scroll', handleScroll);
    
    // 监听鼠标移动事件
    window.addEventListener('mousemove', handleMouseMove);
    
    // 监听滚动事件，应用视差效果
    window.addEventListener('scroll', applyParallaxOnScroll);
    
    // 初始化服务器状态
    updateServerStatus();
    
    // 模拟玩家数量
    simulatePlayerCount();
    
    // 入场动画
    entranceAnimation();
    
    // 检查移动菜单状态
    checkMobileMenu();
    
    // 监听窗口大小变化
    window.addEventListener('resize', checkMobileMenu);
}

// 更新服务器状态
function updateServerStatus() {
    // 获取当前时间
    const now = new Date();
    const day = now.getDay(); // 0-6, 0为星期日
    const hour = now.getHours();
    
    // 定义服务器开放时间（星期日 12:00-23:00）
    const isOpen = day === 0 && hour >= 12 && hour < 23;
    
    // 更新服务器状态指示灯
    if (serverStatusLight) {
        if (isOpen) {
            serverStatusLight.classList.remove('bg-red-500');
            serverStatusLight.classList.add('bg-green-500');
        } else {
            serverStatusLight.classList.remove('bg-green-500');
            serverStatusLight.classList.add('bg-red-500');
        }
    }
}

// 处理滚动事件
function handleScroll() {
    const scrollPosition = window.scrollY;
    
    // 改变导航栏样式
    if (nav) {
        if (scrollPosition > 50) {
            nav.classList.add('bg-dark/90', 'backdrop-blur-md', 'shadow-lg');
            nav.classList.remove('bg-transparent');
        } else {
            nav.classList.remove('bg-dark/90', 'backdrop-blur-md', 'shadow-lg');
            nav.classList.add('bg-transparent');
        }
    }
    
    // 显示/隐藏回到顶部按钮
    if (backToTop) {
        if (scrollPosition > 300) {
            backToTop.classList.remove('opacity-0', 'pointer-events-none');
            backToTop.classList.add('opacity-100');
        } else {
            backToTop.classList.add('opacity-0', 'pointer-events-none');
            backToTop.classList.remove('opacity-100');
        }
    }
}

// 切换移动菜单
function toggleMobileMenu() {
    if (mobileMenu && menuToggle && closeMenu) {
        // 添加过渡类
        mobileMenu.classList.toggle('mobile-menu-visible');
        
        // 更新图标状态
        if (mobileMenu.classList.contains('mobile-menu-visible')) {
            menuToggle.style.display = 'none';
            closeMenu.style.display = 'block';
            document.body.style.overflow = 'hidden'; // 防止背景滚动
        } else {
            setTimeout(() => {
                menuToggle.style.display = 'block';
                closeMenu.style.display = 'none';
                document.body.style.overflow = ''; // 恢复背景滚动
            }, 300); // 与CSS过渡时间匹配
        }
    }
}

// 检查移动菜单状态
function checkMobileMenu() {
    if (window.innerWidth >= 768) {
        // 大屏幕下关闭移动菜单
        if (mobileMenu && mobileMenu.classList.contains('mobile-menu-visible')) {
            toggleMobileMenu();
        }
    }
}

// 平滑滚动到顶部
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 平滑滚动到指定元素
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        window.scrollTo({
            top: element.offsetTop - 80, // 考虑导航栏高度
            behavior: 'smooth'
        });
    }
}

// 处理表单提交
function handleFormSubmit(e) {
    e.preventDefault();
    
    // 获取表单数据
    const form = e.target;
    const formData = new FormData(form);
    
    // 显示提交成功消息
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fa fa-spinner fa-spin mr-2"></i> 提交中...';
    
    // 模拟表单提交
    setTimeout(() => {
        submitButton.innerHTML = '<i class="fa fa-check mr-2"></i> 提交成功!';
        submitButton.classList.add('bg-green-500');
        
        // 重置表单
        form.reset();
        
        // 恢复按钮状态
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
            submitButton.classList.remove('bg-green-500');
        }, 3000);
    }, 1500);
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
        
        // 初始化粒子效果
        createParticles();
        
        // 平滑页面加载
        const elements = document.querySelectorAll('*');
        elements.forEach((element, index) => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            element.style.transitionDelay = `${index * 0.001}s`;
        });
    });
}

// 添加元素悬停效果
function addHoverEffect(element) {
    element.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.transition = 'transform 0.3s ease';
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
}

// 添加增强的悬停效果
function addEnhancedHoverEffects() {
    // 为卡片添加更复杂的悬停效果
    const cards = document.querySelectorAll('.feature-card, .contact-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            this.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
            this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
    
    // 为按钮添加按压效果
    const buttons = document.querySelectorAll('button, .btn');
    buttons.forEach(button => {
        button.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.98)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'scale(1)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// 添加点击反馈动画
function addClickFeedback() {
    // 全局点击反馈效果
    document.addEventListener('click', function(e) {
        // 忽略右键点击
        if (e.button !== 0) return;
        
        // 创建点击效果元素
        const clickEffect = document.createElement('div');
        clickEffect.classList.add('click-effect');
        
        // 设置位置
        clickEffect.style.left = `${e.clientX}px`;
        clickEffect.style.top = `${e.clientY}px`;
        
        // 添加到body
        document.body.appendChild(clickEffect);
        
        // 动画结束后移除
        setTimeout(() => {
            clickEffect.remove();
        }, 1000);
    });
    
    // 为可点击元素添加特定的点击反馈
    allClickableElements.forEach(element => {
        element.addEventListener('click', function(e) {
            e.stopPropagation(); // 防止触发全局点击效果
            
            // 创建特定元素的点击效果
            const elementClickEffect = document.createElement('div');
            elementClickEffect.classList.add('element-click-effect');
            
            // 获取元素的位置和大小
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // 设置位置
            elementClickEffect.style.left = `${x}px`;
            elementClickEffect.style.top = `${y}px`;
            
            // 添加到元素
            this.appendChild(elementClickEffect);
            
            // 动画结束后移除
            setTimeout(() => {
                elementClickEffect.remove();
            }, 800);
        });
    });
}

// 启用元素拖动交互
function enableDraggableElements() {
    const draggableElements = document.querySelectorAll('.draggable-element');
    let draggedElement = null;
    let initialX, initialY, currentX, currentY;
    let initialTranslateX = 0, initialTranslateY = 0;
    
    draggableElements.forEach(element => {
        // 拖动开始
        element.addEventListener('dragstart', function(e) {
            draggedElement = this;
            
            // 存储初始位置
            initialX = e.clientX;
            initialY = e.clientY;
            
            // 获取当前的transform值
            const transform = window.getComputedStyle(this).getPropertyValue('transform');
            if (transform !== 'none') {
                const matrix = new DOMMatrix(transform);
                initialTranslateX = matrix.e;
                initialTranslateY = matrix.f;
            }
            
            // 添加拖动样式
            this.classList.add('dragging');
            this.style.transition = 'none';
        });
        
        // 拖动结束
        element.addEventListener('dragend', function() {
            if (draggedElement === this) {
                // 移除拖动样式
                this.classList.remove('dragging');
                this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                
                // 添加回弹动画
                setTimeout(() => {
                    this.style.transform = 'translateY(-5px) scale(1.02)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 300);
                }, 100);
                
                draggedElement = null;
            }
        });
        
        // 鼠标移动时更新位置
        element.addEventListener('mousemove', function(e) {
            if (draggedElement === this) {
                currentX = e.clientX;
                currentY = e.clientY;
                
                const diffX = currentX - initialX;
                const diffY = currentY - initialY;
                
                this.style.transform = `translate(${initialTranslateX + diffX}px, ${initialTranslateY + diffY}px)`;
            }
        });
    });
    
    // 为了让拖动功能正常工作，需要阻止默认的拖动行为
    document.addEventListener('dragover', function(e) {
        e.preventDefault();
    });
    
    document.addEventListener('drop', function(e) {
        e.preventDefault();
        if (draggedElement) {
            draggedElement.classList.remove('dragging');
            draggedElement.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            draggedElement = null;
        }
    });
}

// 鼠标移动时应用视差效果
function handleMouseMove(e) {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    
    parallaxElements.forEach(element => {
        const depth = element.getAttribute('data-depth') || 0.05;
        const translateX = x * depth * 20;
        const translateY = y * depth * 20;
        
        element.style.transform = `translate(${translateX}px, ${translateY}px)`;
    });
}

// 滚动时应用视差效果
function applyParallaxOnScroll() {
    const scrollPosition = window.scrollY;
    
    if (heroSection) {
        const translateY = scrollPosition * 0.4;
        heroSection.style.backgroundPositionY = `${translateY}px`;
    }
}

// 入场动画
function entranceAnimation() {
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // 为关键元素添加特殊的入场动画
    const keyElements = document.querySelectorAll('h1, .hero-section .btn, #features h2');
    keyElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 1000 + (index * 300));
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