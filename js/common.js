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

// 统一数据管理系统
class DataManager {
    constructor() {
        this.initializeData();
    }

    // 初始化数据
    initializeData() {
        // 个人信息模板
        if (!localStorage.getItem('userProfile')) {
            const defaultUserProfile = {
                id: 'user_001',
                name: '张开发',
                level: 3,
                exp: 2450,
                expToNext: 1550,
                totalExp: 4000,
                reputation: 85,
                avatar: 'default-avatar.png',
                title: '前端工程师',
                skills: {
                    frontend: { level: 8, exp: 1200 },
                    backend: { level: 6, exp: 800 },
                    database: { level: 5, exp: 600 },
                    devops: { level: 4, exp: 300 }
                },
                tokens: {
                    normal: 3,
                    review: 2,
                    reserve: 1,
                    queue: 0,
                    streak: 1
                },
                achievements: ['code_reviewer', 'quick_finisher', 'team_player'],
                currentTasks: ['task_001', 'task_003'],
                taskQueue: ['task_005'],
                stats: {
                    tasksCompleted: 23,
                    successRate: 94,
                    avgCompletionTime: 2.3,
                    streakCount: 7,
                    reviewsGiven: 15,
                    codeQuality: 4.2
                }
            };
            localStorage.setItem('userProfile', JSON.stringify(defaultUserProfile));
        }

        // 任务信息模板
        if (!localStorage.getItem('taskData')) {
            const defaultTasks = {
                available: [
                    {
                        id: 'task_002',
                        title: '用户认证系统优化',
                        description: '重构用户认证系统，实现JWT token刷新机制，添加多因子认证功能，提升系统安全性。',
                        type: 'main', // main主线, side支线
                        priority: 'high', // high高, medium中, low低
                        difficulty: 'medium', // easy简单, medium中等, hard困难, expert专家
                        baseReward: 8,
                        skillRequirements: ['backend', 'security'],
                        estimatedTime: 5,
                        deadline: 5,
                        status: 'available',
                        requiredLevel: 2,
                        tags: ['backend', 'fullstack', 'security']
                    },
                    {
                        id: 'task_004',
                        title: '商品详情页性能优化',
                        description: '优化商品详情页加载速度，减少首屏渲染时间，实现图片懒加载。',
                        type: 'side',
                        priority: 'medium',
                        difficulty: 'easy',
                        baseReward: 3,
                        skillRequirements: ['frontend'],
                        estimatedTime: 2,
                        deadline: 3,
                        status: 'available',
                        requiredLevel: 1,
                        tags: ['frontend', 'performance']
                    },
                    {
                        id: 'task_006',
                        title: '数据库查询优化',
                        description: '分析并优化慢查询，添加合适的索引，提升数据库性能。',
                        type: 'main',
                        priority: 'high',
                        difficulty: 'hard',
                        baseReward: 12,
                        skillRequirements: ['database', 'backend'],
                        estimatedTime: 7,
                        deadline: 10,
                        status: 'available',
                        requiredLevel: 4,
                        tags: ['database', 'performance', 'backend']
                    }
                ],
                inProgress: [
                    {
                        id: 'task_001',
                        title: '前端组件库重构',
                        description: '重构React组件库，提升复用性和性能。',
                        type: 'main',
                        priority: 'high',
                        difficulty: 'medium',
                        baseReward: 10,
                        skillRequirements: ['frontend'],
                        estimatedTime: 7,
                        deadline: 3,
                        status: 'in_progress',
                        assignee: 'user_001',
                        progress: 60,
                        startDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                        tags: ['frontend', 'react']
                    },
                    {
                        id: 'task_003',
                        title: 'API文档编写',
                        description: '为新开发的API编写详细文档。',
                        type: 'side',
                        priority: 'medium',
                        difficulty: 'easy',
                        baseReward: 4,
                        skillRequirements: ['documentation'],
                        estimatedTime: 3,
                        deadline: 2,
                        status: 'in_progress',
                        assignee: 'user_001',
                        progress: 30,
                        startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                        tags: ['documentation']
                    }
                ],
                completed: [
                    {
                        id: 'task_005',
                        title: '登录页面重构',
                        description: '重新设计登录页面UI，提升用户体验。',
                        type: 'side',
                        priority: 'low',
                        difficulty: 'easy',
                        baseReward: 3,
                        skillRequirements: ['frontend'],
                        estimatedTime: 2,
                        status: 'completed',
                        assignee: 'user_001',
                        completedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                        actualTime: 1.5,
                        rating: 4.5,
                        tags: ['frontend', 'ui']
                    }
                ]
            };
            localStorage.setItem('taskData', JSON.stringify(defaultTasks));
        }
    }

    // 获取用户信息
    getUserProfile() {
        return JSON.parse(localStorage.getItem('userProfile'));
    }

    // 更新用户信息
    updateUserProfile(updates) {
        const currentProfile = this.getUserProfile();
        const updatedProfile = { ...currentProfile, ...updates };
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
        this.notifyDataUpdate('userProfile', updatedProfile);
        return updatedProfile;
    }

    // 获取任务数据
    getTaskData() {
        return JSON.parse(localStorage.getItem('taskData'));
    }

    // 更新任务数据
    updateTaskData(updates) {
        const currentData = this.getTaskData();
        const updatedData = { ...currentData, ...updates };
        localStorage.setItem('taskData', JSON.stringify(updatedData));
        this.notifyDataUpdate('taskData', updatedData);
        return updatedData;
    }

    // 添加新任务
    addTask(task) {
        const taskData = this.getTaskData();
        task.id = 'task_' + Date.now();
        task.status = 'available';
        taskData.available.push(task);
        this.updateTaskData(taskData);
        return task;
    }

    // 接取任务
    assignTask(taskId, userId) {
        const taskData = this.getTaskData();
        const taskIndex = taskData.available.findIndex(t => t.id === taskId);
        
        if (taskIndex !== -1) {
            const task = taskData.available[taskIndex];
            task.status = 'in_progress';
            task.assignee = userId;
            task.progress = 0;
            task.startDate = new Date().toISOString();
            
            taskData.available.splice(taskIndex, 1);
            taskData.inProgress.push(task);
            
            // 更新用户当前任务
            const userProfile = this.getUserProfile();
            userProfile.currentTasks.push(taskId);
            this.updateUserProfile(userProfile);
            
            this.updateTaskData(taskData);
            return task;
        }
        return null;
    }

    // 完成任务
    completeTask(taskId, rating = 5) {
        const taskData = this.getTaskData();
        const taskIndex = taskData.inProgress.findIndex(t => t.id === taskId);
        
        if (taskIndex !== -1) {
            const task = taskData.inProgress[taskIndex];
            task.status = 'completed';
            task.completedDate = new Date().toISOString();
            task.rating = rating;
            
            taskData.inProgress.splice(taskIndex, 1);
            taskData.completed.push(task);
            
            // 更新用户信息
            const userProfile = this.getUserProfile();
            const taskIndexInUser = userProfile.currentTasks.indexOf(taskId);
            if (taskIndexInUser !== -1) {
                userProfile.currentTasks.splice(taskIndexInUser, 1);
            }
            userProfile.stats.tasksCompleted++;
            userProfile.exp += task.baseReward;
            
            this.updateUserProfile(userProfile);
            this.updateTaskData(taskData);
            return task;
        }
        return null;
    }

    // 数据更新通知
    notifyDataUpdate(dataType, data) {
        window.dispatchEvent(new CustomEvent('dataUpdate', { 
            detail: { type: dataType, data: data } 
        }));
    }

    // 获取可接取的任务（根据用户等级过滤）
    getAvailableTasks(userLevel = null) {
        const taskData = this.getTaskData();
        const userProfile = userLevel !== null ? { level: userLevel } : this.getUserProfile();
        
        return taskData.available.filter(task => 
            task.requiredLevel <= userProfile.level
        );
    }
}

// 全局数据管理器实例
window.dataManager = new DataManager();

// 工具函数
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1天前';
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
    return `${Math.floor(diffDays / 30)}月前`;
}

function formatTimeLeft(days) {
    if (days < 0) return `超时${Math.abs(days)}天`;
    if (days === 0) return '今天截止';
    if (days === 1) return '明天截止';
    return `${days}天后截止`;
}

function getPriorityColor(priority) {
    const colors = {
        high: '#ff4757',
        medium: '#ffa502',
        low: '#2ed573'
    };
    return colors[priority] || '#ddd';
}

function getDifficultyLabel(difficulty) {
    const labels = {
        easy: '简单',
        medium: '中等',
        hard: '困难',
        expert: '专家'
    };
    return labels[difficulty] || difficulty;
}

function getTypeLabel(type) {
    const labels = {
        main: '主线',
        side: '支线'
    };
    return labels[type] || type;
}

// 添加空状态样式
const emptyMessageStyle = `
    .empty-message {
        text-align: center;
        padding: 20px;
        color: #666;
        font-size: 14px;
        background: #f8f9fa;
        border-radius: 8px;
        margin: 10px 0;
    }
`;

// 动态添加样式
if (!document.getElementById('empty-message-style')) {
    const style = document.createElement('style');
    style.id = 'empty-message-style';
    style.textContent = emptyMessageStyle;
    document.head.appendChild(style);
}

// 初始化通用功能
CommonUtils.init(); 