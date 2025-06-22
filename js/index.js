// 首页增强功能
document.addEventListener('DOMContentLoaded', () => {
    // 初始化浮动卡片动画
    initFloatingCards();
    
    // 初始化滚动动画
    initScrollAnimations();
    
    // 初始化技能条动画
    initSkillBars();
    
    // 初始化交互效果
    initInteractiveElements();
});

// 浮动卡片动画
function initFloatingCards() {
    const cards = document.querySelectorAll('.floating-cards .card');
    
    cards.forEach((card, index) => {
        // 为每个卡片添加悬停效果
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.1)';
            card.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.zIndex = '';
        });
        
        // 添加点击效果
        card.addEventListener('click', () => {
            const cardName = card.querySelector('span').textContent;
            showCardDetail(cardName);
        });
    });
}

// 显示卡片详情
function showCardDetail(cardName) {
    const details = {
        '经验系统': '通过项目贡献、代码审查、问题发现三个维度量化个人努力程度，建立公平的评价体系。',
        '等级认证': '基于技术栈的多维度能力评估，通过任务完成情况认证技能等级，促进技能成长。',
        '任务管理': '智能DDL管理，动态奖惩机制，确保项目进度和质量平衡，提升团队效率。',
        '勋章系统': '记录团队成长历程，增强归属感，支持NFT集成和交易，创造额外价值。'
    };
    
    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'card-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${cardName}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>${details[cardName] || '详细信息正在完善中...'}</p>
            </div>
        </div>
    `;
    
    // 添加样式
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background: white;
        border-radius: 15px;
        padding: 30px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        transform: translateY(50px);
        transition: transform 0.3s ease;
    `;
    
    // 添加到页面
    document.body.appendChild(modal);
    
    // 动画显示
    setTimeout(() => {
        modal.style.opacity = '1';
        modalContent.style.transform = 'translateY(0)';
    }, 10);
    
    // 关闭事件
    const closeModal = () => {
        modal.style.opacity = '0';
        modalContent.style.transform = 'translateY(50px)';
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    };
    
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// 滚动动画增强
function initScrollAnimations() {
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // 特殊动画处理
                if (entry.target.classList.contains('core-values')) {
                    animateValueItems();
                }
                
                if (entry.target.classList.contains('system-preview')) {
                    animatePreviewCards();
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
}

// 价值项动画
function animateValueItems() {
    const valueItems = document.querySelectorAll('.value-item');
    
    valueItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.transform = 'translateY(0)';
            item.style.opacity = '1';
        }, index * 200);
    });
}

// 预览卡片动画
function animatePreviewCards() {
    const previewCards = document.querySelectorAll('.preview-card');
    
    previewCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 300);
    });
}

// 技能条动画
function initSkillBars() {
    const skillBars = document.querySelectorAll('.mini-skill-tree .skill-node');
    
    const animateSkillBars = () => {
        skillBars.forEach((bar, index) => {
            setTimeout(() => {
                if (bar.classList.contains('active')) {
                    bar.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        bar.style.transform = 'scale(1)';
                    }, 200);
                }
            }, index * 100);
        });
    };
    
    // 当技能条进入视窗时触发动画
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
            }
        });
    });
    
    if (skillBars.length > 0) {
        observer.observe(skillBars[0].parentElement);
    }
}

// 交互元素增强
function initInteractiveElements() {
    // 为所有按钮添加涟漪效果
    addRippleEffect();
    
    // 添加卡片悬停效果
    enhanceCardHovers();
    
    // 添加数字计数器效果
    addCounterAnimation();
}

// 涟漪效果
function addRippleEffect() {
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // 添加涟漪动画样式
    if (!document.getElementById('ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// 卡片悬停增强
function enhanceCardHovers() {
    document.querySelectorAll('.value-item, .preview-card, .goal-category').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// 数字计数器动画
function addCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element) => {
        const target = parseInt(element.textContent) || parseFloat(element.textContent);
        const duration = 2000;
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用缓动函数
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = target * easeProgress;
            
            if (element.textContent.includes('%')) {
                element.textContent = Math.round(current) + '%';
            } else if (element.textContent.includes('.')) {
                element.textContent = current.toFixed(1);
            } else {
                element.textContent = Math.round(current);
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    };
    
    // 监听计数器进入视窗
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// 平滑滚动导航
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 添加页面加载完成后的欢迎动画
window.addEventListener('load', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = '0';
        hero.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            hero.style.transition = 'all 1s ease';
            hero.style.opacity = '1';
            hero.style.transform = 'translateY(0)';
        }, 100);
    }
});

// 添加页面滚动进度条
function addScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(45deg, #667eea, #764ba2);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// 初始化滚动进度条
addScrollProgress(); 