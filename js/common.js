// 通用工具函数
class CommonUtils {
    // 导航切换功能
    static initNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });

            // 点击菜单项时关闭移动端菜单
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                });
            });
        }
    }

    // 滚动动画效果
    static initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // 观察所有具有fade-in类的元素
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }

    // 数字计数动画
    static animateNumbers() {
        document.querySelectorAll('.stat-number').forEach(element => {
            const target = parseFloat(element.textContent);
            const duration = 2000; // 2秒
            const start = performance.now();
            
            const animate = (currentTime) => {
                const elapsed = currentTime - start;
                const progress = Math.min(elapsed / duration, 1);
                
                // 使用easeOutQuart缓动函数
                const easeProgress = 1 - Math.pow(1 - progress, 4);
                const current = target * easeProgress;
                
                // 根据数字类型格式化显示
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
        });
    }

    // 页面加载完成后初始化
    static init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initNavigation();
            this.initScrollAnimations();
            
            // 延迟执行数字动画
            setTimeout(() => {
                this.animateNumbers();
            }, 500);
        });
    }
}

// 页面工具类
class PageUtils {
    // 平滑滚动到指定元素
    static scrollToElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // 显示/隐藏加载状态
    static toggleLoading(element, show = true) {
        if (show) {
            element.classList.add('loading');
        } else {
            element.classList.remove('loading');
        }
    }

    // 创建工具提示
    static createTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        
        element.addEventListener('mouseenter', () => {
            document.body.appendChild(tooltip);
            const rect = element.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        });
        
        element.addEventListener('mouseleave', () => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        });
    }

    // 格式化时间
    static formatTime(seconds) {
        if (seconds < 60) {
            return `${seconds}秒`;
        } else if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}分${remainingSeconds}秒`;
        } else {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            return `${hours}小时${minutes}分`;
        }
    }

    // 生成随机ID
    static generateId(prefix = 'id') {
        return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

// 动画工具类
class AnimationUtils {
    // 淡入动画
    static fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    // 淡出动画
    static fadeOut(element, duration = 300) {
        let start = null;
        const initialOpacity = parseFloat(getComputedStyle(element).opacity);
        
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = initialOpacity * (1 - progress);
            
            if (progress >= 1) {
                element.style.display = 'none';
            } else {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    // 滑动进入动画
    static slideIn(element, direction = 'left', duration = 300) {
        const transform = {
            left: 'translateX(-100%)',
            right: 'translateX(100%)',
            up: 'translateY(-100%)',
            down: 'translateY(100%)'
        };
        
        element.style.transform = transform[direction];
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用easeOutCubic缓动
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            element.style.transform = `${transform[direction].replace('100%', `${100 * (1 - easeProgress)}%`)}`;
            element.style.opacity = progress;
            
            if (progress >= 1) {
                element.style.transform = '';
            } else {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }

    // 脉冲动画
    static pulse(element, duration = 1000) {
        element.style.animation = `pulse ${duration}ms ease-in-out infinite`;
    }

    // 移除所有动画
    static clearAnimations(element) {
        element.style.animation = '';
        element.style.transform = '';
        element.style.opacity = '';
    }
}

// 数据工具类
class DataUtils {
    // 生成模拟任务数据
    static generateMockTasks(count = 12) {
        const priorities = ['main', 'side', 'minor'];
        const difficulties = ['simple', 'standard', 'hard'];
        const urgencies = ['relaxed', 'standard', 'critical'];
        const taskNames = [
            '用户登录功能', '支付模块优化', '数据库迁移', '性能监控', 
            'API文档更新', '前端重构', '安全漏洞修复', '移动端适配',
            '缓存机制', '日志系统', '测试用例', '代码审查'
        ];
        
        return Array.from({ length: count }, (_, i) => ({
            id: `task_${i + 1}`,
            title: taskNames[i % taskNames.length],
            priority: priorities[Math.floor(Math.random() * priorities.length)],
            difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
            urgency: urgencies[Math.floor(Math.random() * urgencies.length)],
            estimatedTime: Math.floor(Math.random() * 8) + 1, // 1-8小时
            skills: ['React', 'Node.js', 'MySQL', 'Redis'].slice(0, Math.floor(Math.random() * 3) + 1)
        }));
    }

    // 生成模拟开发者数据
    static generateMockDevelopers(count = 8) {
        const levels = ['newbie', 'intermediate', 'expert'];
        const names = [
            '小明', '小红', '小李', '小王', '小张', '小陈', '小刘', '小赵'
        ];
        const skills = ['React', 'Vue', 'Node.js', 'Python', 'Java', 'MySQL', 'Redis', 'Docker'];
        
        return Array.from({ length: count }, (_, i) => {
            const level = levels[Math.floor(Math.random() * levels.length)];
            const skillCount = level === 'expert' ? 6 : level === 'intermediate' ? 4 : 2;
            
            return {
                id: `dev_${i + 1}`,
                name: names[i % names.length],
                level: level,
                experience: level === 'expert' ? Math.floor(Math.random() * 5000) + 5000 :
                           level === 'intermediate' ? Math.floor(Math.random() * 3000) + 2000 :
                           Math.floor(Math.random() * 1000) + 100,
                fatigue: Math.floor(Math.random() * 60), // 0-60%
                skills: skills.slice(0, skillCount),
                currentTasks: Math.floor(Math.random() * 3), // 0-2个当前任务
                queue: Math.floor(Math.random() * 4) // 0-3个排队任务
            };
        });
    }

    // 计算任务-开发者匹配度
    static calculateMatchScore(task, developer) {
        let score = 0.5; // 基础分数
        
        // 技能匹配
        const skillMatch = task.skills.filter(skill => 
            developer.skills.includes(skill)
        ).length / task.skills.length;
        score += skillMatch * 0.3;
        
        // 难度匹配
        const difficultyMatch = {
            'simple': { 'newbie': 0.2, 'intermediate': 0.1, 'expert': -0.1 },
            'standard': { 'newbie': 0.1, 'intermediate': 0.2, 'expert': 0.1 },
            'hard': { 'newbie': -0.2, 'intermediate': 0.1, 'expert': 0.2 }
        };
        score += difficultyMatch[task.difficulty][developer.level];
        
        // 疲劳值影响
        if (developer.fatigue > 60) score -= 0.2;
        else if (developer.fatigue < 30) score += 0.1;
        
        return Math.max(0, Math.min(1, score));
    }
}

// 初始化通用功能
CommonUtils.init(); 