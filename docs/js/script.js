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

// 表单提交处理函数
function handleFormSubmit(e) {
    e.preventDefault();
    // 基本表单验证和提交逻辑
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    console.log('表单数据:', data);

    // 这里可以添加AJAX请求发送表单数据
    // 显示成功消息或错误处理
    alert('表单已提交，谢谢！');
    contactForm.reset();
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

// 初始化函数
function init() {
    // 检查DOM元素是否存在，避免空引用错误
    if (!navbar || !menuToggle || !mobileMenu || !backToTop) {
        console.warn('部分DOM元素未找到，某些功能可能无法正常工作');
    }

    // 事件监听器 - 使用防抖优化性能
    window.addEventListener('scroll', throttle(handleScroll, 16));

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }

    if (backToTop) {
        backToTop.addEventListener('click', scrollToTop);
    }

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
        // 延迟执行以确保 DOM 完全准备好
        setTimeout(() => {
            createAdvancedParticles();
        }, 100);
    }

    // 每分钟检查一次服务器状态
    setInterval(updateServerStatus, 60000);

    // 初始化版本选择模态窗口
    initVersionModal();
}

// 服务器版本选择模态窗口相关函数
function initVersionModal() {
    console.log('开始初始化版本选择模态窗口...');

    // 全局变量，确保内部函数可以访问
    let joinServerBtn, versionModal, modalBackdrop, modalContent, closeModalBtn, cancelSelectBtn, selectVersionBtn;
    let versionOptions, radioButtons;
    let confirmDialog, confirmBackdrop, confirmContent, confirmMessage, confirmYesBtn, confirmNoBtn;
    let selectedVersion = null;

    // 初始化函数
    function initializeElements() {
        // 获取DOM元素
        joinServerBtn = document.getElementById('join-server-btn');
        versionModal = document.getElementById('version-modal');
        modalBackdrop = document.getElementById('modal-backdrop');
        modalContent = document.getElementById('modal-content');
        closeModalBtn = document.getElementById('close-modal');
        cancelSelectBtn = document.getElementById('cancel-select-btn');
        selectVersionBtn = document.getElementById('select-version-btn');
        versionOptions = document.querySelectorAll('.version-option');
        radioButtons = document.querySelectorAll('input[name="server-version"]');

        // 确认对话框元素
        confirmDialog = document.getElementById('confirm-dialog');
        confirmBackdrop = document.getElementById('confirm-backdrop');
        confirmContent = document.getElementById('confirm-content');
        confirmMessage = document.getElementById('confirm-message');
        confirmYesBtn = document.getElementById('confirm-yes');
        confirmNoBtn = document.getElementById('confirm-no');

        // 检查所有元素是否存在
        const missingElements = [];
        if (!joinServerBtn) missingElements.push('join-server-btn');
        if (!versionModal) missingElements.push('version-modal');
        if (!modalBackdrop) missingElements.push('modal-backdrop');
        if (!modalContent) missingElements.push('modal-content');
        if (!closeModalBtn) missingElements.push('close-modal');
        if (!cancelSelectBtn) missingElements.push('cancel-select-btn');
        if (!selectVersionBtn) missingElements.push('select-version-btn');
        if (!confirmDialog) missingElements.push('confirm-dialog');
        if (!confirmBackdrop) missingElements.push('confirm-backdrop');
        if (!confirmContent) missingElements.push('confirm-content');
        if (!confirmMessage) missingElements.push('confirm-message');
        if (!confirmYesBtn) missingElements.push('confirm-yes');
        if (!confirmNoBtn) missingElements.push('confirm-no');

        if (missingElements.length > 0) {
            console.error('版本选择模态窗口缺少以下DOM元素:', missingElements);
            console.error('请检查HTML中是否包含所有必需的模态窗口元素');
            return false;
        }

        console.log('所有模态窗口DOM元素已找到');
        return true;
    }

    // 初始化样式和状态
    function initializeStyles() {
        // 禁用确认按钮直到选择版本
        selectVersionBtn.disabled = true;

        // 确保模态窗口初始状态正确
        versionModal.style.display = 'none';
        versionModal.classList.add('hidden');
        modalBackdrop.style.opacity = '0';
        modalContent.style.opacity = '0';
        modalContent.style.transform = 'scale(0.95)';

        // 确保确认对话框初始状态正确
        confirmDialog.classList.add('hidden');
        confirmBackdrop.style.opacity = '0';
        confirmContent.style.opacity = '0';
        confirmContent.style.transform = 'scale(0.95)';
    }

    // 打开模态窗口函数
    function openModal() {
        console.log('打开模态窗口');
        try {
            // 防止背景滚动
            document.body.style.overflow = 'hidden';

            // 显示模态窗口
            versionModal.classList.remove('hidden');
            versionModal.style.display = 'flex';
            versionModal.style.zIndex = '9999';

            // 确保背景和内容的z-index正确
            modalBackdrop.style.zIndex = '9998';
            modalContent.style.zIndex = '9999';
            modalContent.style.pointerEvents = 'auto';

            // 添加动画效果
            setTimeout(() => {
                modalBackdrop.style.opacity = '1';
                modalContent.style.opacity = '1';
                modalContent.style.transform = 'scale(1)';
            }, 10);
        } catch (error) {
            console.error('打开模态窗口时出错:', error);
        }
    }

    // 关闭模态窗口函数
    function closeModal() {
        console.log('关闭模态窗口');
        try {
            // 移除动画效果
            modalBackdrop.style.opacity = '0';
            modalContent.style.opacity = '0';
            modalContent.style.transform = 'scale(0.95)';

            // 隐藏模态窗口
            setTimeout(() => {
                versionModal.classList.add('hidden');
                versionModal.style.display = 'none';
                // 恢复背景滚动
                document.body.style.overflow = 'auto';
                // 重置选中状态
                resetSelection();
            }, 300);
        } catch (error) {
            console.error('关闭模态窗口时出错:', error);
        }
    }

    // 打开确认对话框函数
    function openConfirmDialog(version) {
        const versionNames = {
            '3.9.8': '3.9.8 低配版本',
            '3.11': '3.11 还原版本'
        };

        // 更新确认消息
        confirmMessage.textContent = `您确定要选择 ${versionNames[version]} 吗？`;

        // 显示确认对话框
        confirmDialog.classList.remove('hidden');
        confirmDialog.style.zIndex = '10000';

        // 确保背景和内容的z-index正确
        confirmBackdrop.style.zIndex = '9999';
        confirmContent.style.zIndex = '10000';
        confirmContent.style.pointerEvents = 'auto';

        // 添加动画效果
        setTimeout(() => {
            confirmBackdrop.style.opacity = '1';
            confirmContent.style.opacity = '1';
            confirmContent.style.transform = 'scale(1)';
        }, 10);
    }

    // 关闭确认对话框函数
    function closeConfirmDialog() {
        // 移除动画效果
        confirmBackdrop.style.opacity = '0';
        confirmContent.style.opacity = '0';
        confirmContent.style.transform = 'scale(0.95)';

        // 隐藏确认对话框
        setTimeout(() => {
            confirmDialog.classList.add('hidden');
        }, 300);
    }

    // 重置选择状态
    function resetSelection() {
        // 取消所有单选按钮的选择
        radioButtons.forEach(radio => {
            radio.checked = false;
        });

        // 移除版本选项的选中样式
        versionOptions.forEach(option => {
            option.classList.remove('border-primary', 'border-secondary');
            option.classList.add('border-white/10');
        });

        // 重置选中版本和禁用确认按钮
        selectedVersion = null;
        selectVersionBtn.disabled = true;
    }

    // 处理版本选择
    function handleVersionSelect(version) {
        // 更新选中版本
        selectedVersion = version;

        // 更新确认按钮状态
        selectVersionBtn.disabled = false;

        // 更新UI状态
        versionOptions.forEach(option => {
            option.classList.remove('border-primary', 'border-secondary', 'border-white/10');
            if (option.id === `version-${version.replace('.', '')}`) {
                option.classList.add(version === '3.9.8' ? 'border-primary' : 'border-secondary');
            } else {
                option.classList.add('border-white/10');
            }
        });
    }

    // 处理最终确认
    function handleFinalConfirmation() {
        if (!selectedVersion) return;

        // 存储选择的版本到localStorage
        try {
            localStorage.setItem('selectedServerVersion', selectedVersion);
        } catch (e) {
            console.warn('无法存储选择的版本:', e);
        }

        // 关闭所有窗口
        closeConfirmDialog();
        closeModal();

        // 跳转到相应的版本指南页面作为回退方案
        const guideUrls = {
            '3.9.8': 'guides/guide-3.9.8.html',
            '3.11': 'guides/guide-3.11.html'
        };

        if (guideUrls[selectedVersion]) {
            window.location.href = guideUrls[selectedVersion];
        } else {
            // 如果没有对应的URL，显示通知
            setTimeout(() => {
                showVersionNotification(selectedVersion);
            }, 500);
        }
    }

    // 显示版本选择通知
    function showVersionNotification(version) {
        // 检查是否已存在通知元素
        let notification = document.getElementById('version-notification');

        if (!notification) {
            // 创建通知元素
            notification = document.createElement('div');
            notification.id = 'version-notification';
            notification.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-dark border border-white/10 rounded-xl px-6 py-4 shadow-lg z-50 transition-all duration-300 opacity-0 scale-95';
            document.body.appendChild(notification);
        }

        // 设置通知内容
        const versionNames = {
            '3.9.8': '3.9.8 低配版本',
            '3.11': '3.11 还原版本'
        };

        notification.innerHTML = `
            <div class="flex items-center space-x-4">
                <div class="w-10 h-10 rounded-full ${version === '3.9.8' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'} flex items-center justify-center">
                    <i class="fa fa-check text-xl"></i>
                </div>
                <div>
                    <h4 class="font-bold text-white">已选择 ${versionNames[version]}</h4>
                    <p class="text-light/70 text-sm">正在显示相应版本的安装指南...</p>
                </div>
            </div>
        `;

        // 显示通知
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translate(-50%, 0) scale(1)';
        }, 10);

        // 3秒后隐藏通知
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translate(-50%, 10px) scale(0.95)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // 绑定事件监听器
    function bindEventListeners() {
        // 立即加入按钮点击事件
        if (joinServerBtn) {
            // 移除可能存在的旧事件监听器
            joinServerBtn.onclick = null;
            
            // 添加新的事件监听器
            joinServerBtn.addEventListener('click', function (e) {
                console.log('立即加入按钮被点击');
                e.preventDefault();
                e.stopPropagation();
                openModal();
            });
            console.log('立即加入按钮事件绑定成功');
        } else {
            console.error('找不到立即加入按钮元素');
        }

        // 关闭按钮点击事件
        closeModalBtn.addEventListener('click', closeModal);
        cancelSelectBtn.addEventListener('click', closeModal);

        // 点击背景关闭模态窗口
        modalBackdrop.addEventListener('click', closeModal);

        // 阻止点击内容时关闭模态窗口
        modalContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // 单选按钮变化事件
        radioButtons.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    handleVersionSelect(e.target.value);
                }
            });
        });

        // 版本选项点击事件
        versionOptions.forEach(option => {
            option.addEventListener('click', () => {
                const version = option.id.replace('version-', '').replace('398', '3.9.8').replace('311', '3.11');
                const radio = document.querySelector(`input[name="server-version"][value="${version}"]`);
                if (radio) {
                    radio.checked = true;
                    handleVersionSelect(version);
                }
            });
        });

        // 确认选择按钮点击事件
        selectVersionBtn.addEventListener('click', () => {
            if (selectedVersion) {
                openConfirmDialog(selectedVersion);
            }
        });

        // 确认对话框事件
        confirmNoBtn.addEventListener('click', closeConfirmDialog);
        confirmYesBtn.addEventListener('click', handleFinalConfirmation);

        // 点击背景关闭确认对话框
        confirmBackdrop.addEventListener('click', closeConfirmDialog);

        // 阻止点击内容时关闭确认对话框
        confirmContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // ESC键关闭当前打开的窗口
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (!confirmDialog.classList.contains('hidden')) {
                    closeConfirmDialog();
                } else if (!versionModal.classList.contains('hidden')) {
                    closeModal();
                }
            }
        });
    }

    // 主初始化流程
    if (initializeElements()) {
        initializeStyles();
        bindEventListeners();
        console.log('版本选择模态窗口初始化完成');
    }
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
    return function () {
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
    return function () {
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
    if (navbar) {
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    lastScrollTop = scrollTop;

    // 返回顶部按钮显示/隐藏
    if (backToTop) {
        if (scrollTop > 300) {
            backToTop.classList.add('visible');
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.classList.remove('visible');
            backToTop.style.opacity = '0.3'; // 降低透明度但保持可见
            backToTop.style.visibility = 'visible';
        }
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
    // 获取链接地址
    const targetId = this.getAttribute('href');

    // 判断是否为内部锚点链接（以#开头）
    if (targetId.startsWith('#')) {
        e.preventDefault();

        // 关闭移动菜单
        if (!mobileMenu.classList.contains('hidden')) {
            toggleMobileMenu();
        }

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // 减去导航栏高度
                behavior: 'smooth'
            });
        }
    }
    // 外部链接不阻止默认行为，让浏览器正常跳转
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

    // 检查 document.body 是否存在
    if (!document.body) {
        console.warn('document.body not ready, skipping particle creation');
        return;
    }

    const particlesContainer = document.createElement('div');
    particlesContainer.classList.add('particles-container');
    // 设置必要的CSS样式
    particlesContainer.style.position = 'fixed';
    particlesContainer.style.top = '0';
    particlesContainer.style.left = '0';
    particlesContainer.style.width = '100%';
    particlesContainer.style.height = '100%';
    particlesContainer.style.pointerEvents = 'none';
    particlesContainer.style.zIndex = '0';
    document.body.appendChild(particlesContainer);

    const particleCount = window.innerWidth > 1024 ? 100 : window.innerWidth > 768 ? 50 : 30; // 减少粒子数量以提高性能

    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer, i);
    }

    particlesCreated = true;
}

function createParticle(container, index) {
    const particle = document.createElement('div');
    particle.classList.add('particle');

    // 随机属性
    const size = Math.random() * 3 + 1;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const opacity = Math.random() * 0.5 + 0.1;
    const delay = Math.random() * 8;
    const duration = Math.random() * 15 + 10;

    // 随机颜色
    const colors = ['#FF4D4D', '#3D5A80', '#F2CC8F', '#EEF5FF', '#FF6B6B', '#5A79A5'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    // 设置粒子样式
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

    container.appendChild(particle);
}

// 华丽加载动画
function createLoadingAnimation() {
    // 仅作为占位函数，如果需要可以实现具体的加载动画
    console.log('加载动画功能准备就绪');
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

// 注意：createParticles函数已被createAdvancedParticles替代，保留兼容性



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
const resizeHandler = debounce(adjustContentHeight, 250);
window.addEventListener('resize', resizeHandler);

// 初始化页面
window.addEventListener('DOMContentLoaded', () => {
    console.log('页面DOM加载完成，开始初始化...');

    // 确保DOM元素存在
    const joinServerBtn = document.getElementById('join-server-btn');
    if (joinServerBtn) {
        console.log('找到立即加入按钮元素');
    } else {
        console.error('找不到立即加入按钮元素');
    }

    // 延迟初始化以确保所有元素都已渲染
    setTimeout(() => {
        init();
        adjustContentHeight();
        addLinkHoverEffects();
        // createParticles(); // 可选：如果需要粒子效果，可以取消注释

        // 确保所有元素初始可见（只处理有 scroll-reveal 类的元素）
        const revealElements = document.querySelectorAll('.scroll-reveal');
        revealElements.forEach(el => {
            if (el.style.opacity === '0' || el.style.opacity === '') {
                el.style.opacity = '1';
            }
        });

        // 添加页面卸载时的清理函数，防止内存泄漏
        window.addEventListener('beforeunload', () => {
            // 移除事件监听器
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', resizeHandler);
        });

        console.log('页面初始化完成');
    }, 100);
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

