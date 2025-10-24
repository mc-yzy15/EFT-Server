// DOM 元素
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const backToTop = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');
const navLinks = document.querySelectorAll('.nav-link, #mobile-menu a');
const serverStatusLight = document.getElementById('server-status-light');
const serverStatusContainer = document.getElementById('server-status-container');

// 性能优化变量
let lastScrollTop = 0;
let ticking = false;
let particlesCreated = false;

// 初始化函数
function init() {
    // 事件监听器 - 使用防抖优化性能
    window.addEventListener('scroll', throttle(handleScroll, 16));
    menuToggle.addEventListener('click', toggleMobileMenu);
    backToTop.addEventListener('click', scrollToTop);
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });
    
    // 添加鼠标交互效果
    addMagneticEffects();
    addHoverEffects();
    
    // 添加滚动显示动画
    addScrollReveal();
    
    // 添加键盘快捷键
    addKeyboardShortcuts();
    
    // 性能优化
    optimizePerformance();
    optimizeForTouch();
    
    // 监听窗口大小变化
    window.addEventListener('resize', debounce(checkMobileMenu, 250));
    
    // 更新服务器状态
    updateServerStatus();
    
    // 创建粒子效果（只在桌面端）
    if (window.innerWidth > 768) {
        createAdvancedParticles();
    }
    
    // 添加页面加载进度条
    createLoadingAnimation();
    
    // 每分钟检查一次服务器状态
    setInterval(updateServerStatus, 60000);
}

// 更新服务器状态
function updateServerStatus() {
    if (!serverStatusLight) return;
    
    const now = new Date();
    const day = now.getDay(); // 0 = 星期日, 1 = 星期一, ..., 6 = 星期六
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // 当前时间的总分钟数
    const currentMinutes = hours * 60 + minutes;
    
    let status = 'closed'; // 默认关闭状态
    
    // 检查是否是开放时间
    if (day === 6) {
        // 周六: 全天开放
        status = 'open';
    } else if (day === 0) {
        // 周日: 00:00 - 18:00
        const openTime = 0; // 00:00
        const closeTime = 18 * 60; // 18:00
        
        if (currentMinutes >= openTime && currentMinutes <= closeTime) {
            status = 'open';
        }
    } else if ((day === 5 && hours >= 20) || (day === 1 && hours < 2)) {
        // 周五晚上8点后和周一凌晨2点前 - 可能开启的时段
        status = 'maybe';
    }
    
    // 更新状态灯颜色和动画
    if (status === 'open') {
        serverStatusLight.className = 'w-3 h-3 rounded-full bg-green-500 animate-pulse';
        if (serverStatusContainer.querySelector('.status-text')) {
            serverStatusContainer.querySelector('.status-text').innerText = '在线';
        }
    } else if (status === 'maybe') {
        serverStatusLight.className = 'w-3 h-3 rounded-full bg-yellow-500 animate-pulse';
        if (serverStatusContainer.querySelector('.status-text')) {
            serverStatusContainer.querySelector('.status-text').innerText = '可能在线';
        }
    } else {
        serverStatusLight.className = 'w-3 h-3 rounded-full bg-red-500';
        if (serverStatusContainer.querySelector('.status-text')) {
            serverStatusContainer.querySelector('.status-text').innerText = '离线';
        }
    }
}

// 性能优化函数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// 处理滚动事件
function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // 导航栏滚动效果
    if (scrollTop > 50) {
        navbar.classList.add('scrolled');
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
    } else {
        navbar.classList.remove('scrolled');
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
    
    // 返回顶部按钮显示/隐藏
    if (scrollTop > 300) {
        backToTop.classList.add('visible');
        backToTop.style.opacity = '1';
        backToTop.style.visibility = 'visible';
    } else {
        backToTop.classList.remove('visible');
        backToTop.style.opacity = '1'; // 保持可见
        backToTop.style.visibility = 'visible'; // 保持可见
    }
    
    // 视差效果
    updateParallax(scrollTop);
    
    // 检查元素是否在视口中并添加动画
    if (!ticking) {
        requestAnimationFrame(() => {
            checkElementsInView();
            ticking = false;
        });
        ticking = true;
    }
}

// 视差滚动效果
function updateParallax(scrollTop) {
    const parallaxElements = document.querySelectorAll('.parallax-bg');
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrollTop * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
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

// 添加滚动显示动画
function addScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    revealElements.forEach((element, index) => {
        // 移除初始隐藏，改为默认可见
        // element.style.opacity = '0';
        // element.style.transform = 'translateY(50px)';
        element.style.transition = 'all 0.8s cubic-bezier(0.215, 0.610, 0.355, 1)';
        element.dataset.delay = index * 100;
    });
}

// 添加磁性按钮效果
function addMagneticEffects() {
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX * 10;
            const deltaY = (y - centerY) / centerY * 10;
            
            btn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

// 添加悬停效果
function addHoverEffects() {
    const hoverElements = document.querySelectorAll('.hover-zoom, .hover-scale');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = element.classList.contains('hover-zoom') 
                ? 'perspective(1000px) rotateX(5deg) rotateY(5deg) scale(1.05)'
                : 'scale(1.06)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'none';
        });
    });
}

// 检查元素是否在视口中
function checkElementsInView() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            // 确保元素可见
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            element.classList.add('revealed');
        }
    });
}

// 创建高级粒子效果
function createAdvancedParticles() {
    if (particlesCreated) return;
    
    const particlesContainer = document.createElement('div');
    particlesContainer.classList.add('particles-container');
    document.body.appendChild(particlesContainer);
    
    const particleCount = window.innerWidth > 1024 ? 200 : window.innerWidth > 768 ? 100 : 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer, i);
    }
    
    particlesCreated = true;
}

function createParticle(container, index) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // 随机属性
    const size = Math.random() * 4 + 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const opacity = Math.random() * 0.7 + 0.1;
    const delay = Math.random() * 8;
    const duration = Math.random() * 8 + 6;
    
    // 随机颜色
    const colors = ['#FF4D4D', '#3D5A80', '#F2CC8F', '#EEF5FF', '#FF6B6B', '#5A79A5'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = color;
    particle.style.left = `${x}%`;
    particle.style.top = `${y}%`;
    particle.style.opacity = opacity;
    particle.style.animationDelay = `${delay}s`;
    particle.style.animationDuration = `${duration}s`;
    
    container.appendChild(particle);
}

// 华丽加载动画
function createLoadingAnimation() {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingProgress = document.querySelector('.loading-progress');
    const loadingText = document.querySelector('.loading-text');
    
    if (!loadingScreen || !loadingProgress) return;
    
    // 确保加载屏幕初始可见
    loadingScreen.style.display = 'flex';
    loadingScreen.style.opacity = '1';
    loadingScreen.style.pointerEvents = 'all';
    
    // 动态调整加载动画容器大小
    function adjustLoadingContainer() {
        const container = document.querySelector('.loading-container');
        if (!container) return;
        
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        // 根据屏幕尺寸调整容器大小
        if (screenWidth < 768) {
            container.style.width = '90%';
            container.style.padding = '1.5rem';
        } else if (screenWidth < 1024) {
            container.style.width = '70%';
            container.style.padding = '2rem';
        } else {
            container.style.width = '400px';
            container.style.padding = '2rem';
        }
        
        // 根据屏幕高度调整容器位置
        if (screenHeight < 600) {
            container.style.padding = '1rem';
        }
    }
    
    // 初始调整
    adjustLoadingContainer();
    
    // 监听窗口大小变化
    window.addEventListener('resize', adjustLoadingContainer);
    
    // 模拟加载进度和状态文本
    const loadingStates = [
        '正在初始化...',
        '加载资源...', 
        '准备界面...',
        '优化性能...',
        '即将完成...'
    ];
    let progress = 0;
    let stateIndex = 0;
    
    const interval = setInterval(() => {
        // 更新进度
        progress += Math.random() * 12 + 3; // 3-15% 的随机增量
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // 更新最终状态文本
            if (loadingText) {
                loadingText.textContent = '加载完成！';
            }
            
            // 加载完成后淡出动画
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    loadingScreen.style.pointerEvents = 'none';
                    // 触发自定义事件表示加载完成
                    window.dispatchEvent(new CustomEvent('loadingComplete'));
                }, 800);
            }, 800);
        } else {
            // 更新状态文本
            if (loadingText && progress > (stateIndex + 1) * 20) {
                stateIndex = Math.min(stateIndex + 1, loadingStates.length - 1);
                loadingText.textContent = loadingStates[stateIndex];
            }
        }
        
        loadingProgress.style.width = `${progress}%`;
    }, 200);
    
    // 添加额外的安全机制，确保加载动画不会永远显示
    const safetyTimeout = setTimeout(() => {
        if (loadingScreen.style.display !== 'none') {
            console.log('安全超时：强制隐藏加载动画');
            clearInterval(interval);
            loadingProgress.style.width = '100%';
            if (loadingText) {
                loadingText.textContent = '加载完成！';
            }
            
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    loadingScreen.style.pointerEvents = 'none';
                }, 800);
            }, 500);
        }
    }, 5000); // 5秒后强制隐藏
    
    // 当加载完成时清除安全超时
    window.addEventListener('loadingComplete', () => {
        clearTimeout(safetyTimeout);
    });
    
    // 监听页面加载完成事件
    window.addEventListener('load', () => {
        clearTimeout(safetyTimeout);
        clearInterval(interval);
        
        // 立即完成加载进度
        loadingProgress.style.width = '100%';
        if (loadingText) {
            loadingText.textContent = '加载完成！';
        }
        
        setTimeout(() => {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                loadingScreen.style.pointerEvents = 'none';
                window.dispatchEvent(new CustomEvent('loadingComplete'));
            }, 800);
        }, 300);
    });
}

// 创建加载进度条（保持向后兼容）
function createLoadingBar() {
    createLoadingAnimation();
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
            const loading = document.getElementById('loading-screen');
            if (loading) {
                loading.classList.add('fade-out');
                setTimeout(() => {
                    loading.style.display = 'none';
                }, 800);
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
    
    // 确保所有元素初始可见
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
        if (el.style.opacity === '0') {
            el.style.opacity = '1';
        }
    });
    
    // 额外确保加载动画能隐藏（防止出现异常）
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen && loadingScreen.style.display !== 'none') {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 800);
        }
    }, 3000); // 3秒后强制隐藏加载动画
});



// 添加键盘快捷键
function addKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // ESC键关闭移动菜单
        if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
            toggleMobileMenu();
        }
        
        // Ctrl + / 或 Cmd + / 显示帮助
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            showKeyboardShortcuts();
        }
    });
}

// 显示键盘快捷键帮助
function showKeyboardShortcuts() {
    const shortcuts = [
        { key: 'ESC', action: '关闭菜单' },
        { key: 'Ctrl+/ 或 Cmd+/', action: '显示快捷键帮助' },
        { key: 'Home', action: '回到顶部' }
    ];
    
    // 这里可以添加一个漂亮的模态框显示快捷键
    console.log('键盘快捷键:', shortcuts);
}

// 页面性能优化
function optimizePerformance() {
    // 延迟加载非关键资源
    const lazyLoadImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    lazyLoadImages.forEach(img => imageObserver.observe(img));
}



// 触摸设备优化
function optimizeForTouch() {
    if ('ontouchstart' in window) {
        // 为触摸设备优化交互
        document.body.classList.add('touch-device');
        
        // 移除部分悬停效果以避免触摸设备上的问题
        const hoverElements = document.querySelectorAll('.hover-scale, .hover-zoom');
        hoverElements.forEach(el => {
            el.classList.add('touch-optimized');
        });
    }
}

// 导出函数（用于调试和扩展）
window.EFTSERVER = {
    init,
    handleScroll,
    smoothScroll,
    addKeyboardShortcuts,
    optimizePerformance,
    createLoadingAnimation
};