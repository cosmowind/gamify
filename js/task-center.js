// 任务系统 - 完整功能实现
// 全局变量和函数定义
let taskIdCounter = 1000;
let availableTasks = [];
let userTasks = {
    slot1: null,
    slot2: null,
    slot3: null
};

// 任务发布功能 - 全局函数
function togglePublishForm() {
    const form = document.getElementById('publishForm');
    form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

function publishTask() {
    const title = document.getElementById('taskTitle').value;
    const type = document.getElementById('taskType').value;
    const difficulty = document.getElementById('taskDifficulty').value;
    const priority = document.getElementById('taskPriority').value;
    const reward = parseInt(document.getElementById('taskReward').value);
    const duration = parseInt(document.getElementById('taskDuration').value);
    const description = document.getElementById('taskDescription').value;
    
    const skillCheckboxes = document.querySelectorAll('.skill-tags input[type="checkbox"]:checked');
    const skills = Array.from(skillCheckboxes).map(cb => cb.value);
    
    if (!title || !description) {
        alert('请填写任务标题和描述');
        return;
    }
    
    const newTask = {
        id: ++taskIdCounter,
        title,
        type,
        priority,
        difficulty,
        reward,
        duration,
        description,
        skills,
        createdAt: new Date(),
        deadline: new Date(Date.now() + duration * 24 * 60 * 60 * 1000)
    };
    
    availableTasks.unshift(newTask);
    renderAvailableTasks();
    togglePublishForm();
    
    // 清空表单
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
    document.querySelectorAll('.skill-tags input[type="checkbox"]').forEach(cb => cb.checked = false);
    
    alert('任务发布成功！');
}

// 接取任务 - 全局函数
function acceptTask(taskId) {
    // 查找空闲的任务槽位
    const emptySlot = Object.keys(userTasks).find(slot => userTasks[slot] === null);
    
    if (!emptySlot) {
        alert('任务槽位已满！请先完成或放弃现有任务');
        return;
    }
    
    const task = availableTasks.find(t => t.id === taskId);
    if (!task) {
        alert('任务不存在');
        return;
    }
    
    // 将任务从可接取列表移除
    availableTasks = availableTasks.filter(t => t.id !== taskId);
    
    // 添加任务到用户槽位
    userTasks[emptySlot] = {
        ...task,
        acceptedAt: new Date(),
        progress: 0,
        status: 'in_progress'
    };
    
    renderAvailableTasks();
    renderUserTasks();
    updateCharacterPanelTasks(); // 同步人物面板
    
    // 清空任务详情
    document.getElementById('taskDetailSection').innerHTML = `
        <div class="no-selection">
            <div class="empty-icon">✅</div>
            <div class="empty-text">任务接取成功！</div>
            <div class="empty-desc">已添加到右侧任务槽位，开始开发吧！</div>
        </div>
    `;
    
    alert(`任务接取成功！\n任务已分配到${emptySlot.replace('slot', '槽位')}`);
}

// 提交任务 - 全局函数
function submitTask(slotId) {
    const task = userTasks[slotId];
    if (!task) return;
    
    if (confirm(`确认提交任务："${task.title}"？\n\n提交后将进入代码审查阶段`)) {
        task.status = 'submitted';
        task.submittedAt = new Date();
        renderUserTasks();
        updateCharacterPanelTasks(); // 同步人物面板
        
        // 模拟审查过程
        setTimeout(() => {
            const isOnTime = new Date() <= task.deadline;
            const currentStreak = parseInt(document.getElementById('currentStreak').textContent);
            
            if (isOnTime) {
                // 按时完成，计算连胜奖励
                const newStreak = currentStreak + 1;
                const streakBonus = Math.log(newStreak) / 100;
                const finalReward = Math.round(task.reward * (1 + streakBonus) * 30);
                
                alert(`🎉 任务完成！\n\n✅ 按时完成\n🔥 连胜: ${newStreak}\n💎 获得经验: ${finalReward}\n📈 奖励倍率: +${(streakBonus * 100).toFixed(1)}%`);
                
                // 更新统计
                document.getElementById('currentStreak').textContent = newStreak;
                document.getElementById('completedTasks').textContent = parseInt(document.getElementById('completedTasks').textContent) + 1;
                document.getElementById('totalExp').textContent = parseInt(document.getElementById('totalExp').textContent) + finalReward;
                
                // 更新连胜显示
                document.querySelector('.streak-number').textContent = newStreak;
                document.querySelector('.bonus-value').textContent = `+${(streakBonus * 100).toFixed(1)}%`;
            } else {
                // 超时完成
                const daysLate = Math.ceil((new Date() - task.deadline) / (1000 * 60 * 60 * 24));
                const penalty = Math.exp(daysLate) / 100;
                const finalReward = Math.max(10, Math.round(task.reward * (1 - penalty) * 30));
                
                alert(`⚠️ 任务完成（超时）\n\n❌ 超时 ${daysLate} 天\n💔 连胜中断\n💎 获得经验: ${finalReward}\n📉 惩罚倍率: -${(penalty * 100).toFixed(1)}%`);
                
                // 重置连胜
                document.getElementById('currentStreak').textContent = '0';
                document.querySelector('.streak-number').textContent = '0';
                document.querySelector('.bonus-value').textContent = '+0%';
                
                // 更新统计
                document.getElementById('completedTasks').textContent = parseInt(document.getElementById('completedTasks').textContent) + 1;
                document.getElementById('totalExp').textContent = parseInt(document.getElementById('totalExp').textContent) + finalReward;
            }
            
            // 清空槽位
            userTasks[slotId] = null;
            renderUserTasks();
            updateCharacterPanelTasks(); // 同步人物面板
            
        }, 2000);
    }
}

// 放弃任务 - 全局函数
function abandonTask(slotId) {
    const task = userTasks[slotId];
    if (!task) return;
    
    if (confirm(`确认放弃任务："${task.title}"？\n\n放弃后任务将重新回到任务池`)) {
        // 将任务重新加入可接取列表
        availableTasks.unshift(task);
        
        // 清空槽位
        userTasks[slotId] = null;
        
        renderAvailableTasks();
        renderUserTasks();
        updateCharacterPanelTasks(); // 同步人物面板
        
        alert('任务已放弃，重新回到任务池');
    }
}

// 更新人物面板任务队列的函数
function updateCharacterPanelTasks() {
    // 如果在人物面板页面，则更新任务队列
    if (typeof updateTaskQueue === 'function') {
        updateTaskQueue(userTasks);
    }
    
    // 保存到localStorage以便其他页面读取
    localStorage.setItem('userTasks', JSON.stringify(userTasks));
}

document.addEventListener('DOMContentLoaded', function() {
    
    // 初始化默认任务
    const defaultTasks = [
        {
            id: 1001,
            title: "商品详情页性能优化",
            type: "main",
            priority: "high",
            difficulty: "normal",
            reward: 6,
            duration: 3,
            description: "优化商品详情页加载速度，减少首屏渲染时间，实现图片懒加载和缓存策略。预期提升30%的页面性能。",
            skills: ["frontend"],
            createdAt: new Date(),
            deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        },
        {
            id: 1002,
            title: "用户认证系统优化",
            type: "main",
            priority: "urgent",
            difficulty: "hard",
            reward: 8,
            duration: 5,
            description: "重构用户认证系统，实现JWT token刷新机制，添加多因素认证功能，提升系统安全性。",
            skills: ["backend", "fullstack"],
            createdAt: new Date(),
            deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
        },
        {
            id: 1003,
            title: "API文档更新",
            type: "side",
            priority: "normal",
            difficulty: "simple",
            reward: 3,
            duration: 2,
            description: "更新REST API文档，补充接口参数说明，添加使用示例，完善错误码说明。",
            skills: ["backend"],
            createdAt: new Date(),
            deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        },
        {
            id: 1004,
            title: "移动端响应式优化",
            type: "side",
            priority: "normal",
            difficulty: "normal",
            reward: 5,
            duration: 4,
            description: "优化移动端界面显示，实现完全响应式设计，适配各种屏幕尺寸。",
            skills: ["frontend", "mobile"],
            createdAt: new Date(),
            deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
        },
        {
            id: 1005,
            title: "数据库性能调优",
            type: "main",
            priority: "high",
            difficulty: "hard",
            reward: 9,
            duration: 7,
            description: "分析数据库查询性能，优化慢查询，建立合适的索引，提升数据库整体性能。",
            skills: ["backend", "devops"],
            createdAt: new Date(),
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
    ];
    
    // 从localStorage读取任务状态
    const savedTasks = localStorage.getItem('userTasks');
    if (savedTasks) {
        try {
            userTasks = JSON.parse(savedTasks);
        } catch (e) {
            console.warn('Failed to parse saved tasks:', e);
        }
    }
    
    availableTasks = [...defaultTasks];

    // 渲染可接取任务列表
    function renderAvailableTasks() {
        const container = document.getElementById('availableTasks');
        if (!container) return;
        
        container.innerHTML = '';
        
        const filteredTasks = filterTasks();
        
        if (filteredTasks.length === 0) {
            container.innerHTML = '<div class="empty-text">暂无符合条件的任务</div>';
            return;
        }
        
        filteredTasks.forEach(task => {
            const taskElement = createTaskCard(task);
            container.appendChild(taskElement);
        });
    }

    function createTaskCard(task) {
        const daysLeft = Math.ceil((task.deadline - new Date()) / (1000 * 60 * 60 * 24));
        const urgencyClass = daysLeft <= 1 ? 'urgent' : daysLeft <= 3 ? 'warning' : 'normal';
        
        const card = document.createElement('div');
        card.className = 'task-card';
        card.dataset.taskId = task.id;
        card.innerHTML = `
            <div class="task-header">
                <div class="task-title">${task.title}</div>
                <div class="task-meta">
                    <span class="task-tag type-${task.type}">${task.type === 'main' ? '主线' : '支线'}</span>
                    <span class="task-tag priority-${task.priority}">${getPriorityText(task.priority)}</span>
                    <span class="task-tag difficulty-${task.difficulty}">${getDifficultyText(task.difficulty)}</span>
                </div>
            </div>
            <div class="task-description">${task.description.substring(0, 80)}...</div>
            <div class="task-footer">
                <div class="task-reward">💎 奖励：${task.reward} | 预计经验：${task.reward * 30}+</div>
                <div class="task-deadline ${urgencyClass}">截止：${daysLeft}天后</div>
            </div>
        `;
        
        card.addEventListener('click', () => showTaskDetail(task));
        return card;
    }

    function getPriorityText(priority) {
        const map = {
            'low': '低优先级',
            'normal': '普通',
            'high': '高优先级',
            'urgent': '紧急'
        };
        return map[priority] || priority;
    }

    function getDifficultyText(difficulty) {
        const map = {
            'simple': '简单',
            'normal': '标准',
            'hard': '困难'
        };
        return map[difficulty] || difficulty;
    }

    // 显示任务详情
    function showTaskDetail(task) {
        const container = document.getElementById('taskDetailSection');
        const daysLeft = Math.ceil((task.deadline - new Date()) / (1000 * 60 * 60 * 24));
        
        container.innerHTML = `
            <div class="task-detail">
                <div class="task-detail-header">
                    <div>
                        <div class="task-detail-title">${task.title}</div>
                        <div class="task-detail-meta">
                            <span class="detail-tag type-${task.type}">${task.type === 'main' ? '主线任务' : '支线任务'}</span>
                            <span class="detail-tag priority-${task.priority}">${getPriorityText(task.priority)}</span>
                            <span class="detail-tag difficulty-${task.difficulty}">${getDifficultyText(task.difficulty)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="task-detail-description">${task.description}</div>
                
                <div class="task-detail-info">
                    <div class="info-item">
                        <div class="info-label">基础奖励</div>
                        <div class="info-value">${task.reward}分</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">预计经验</div>
                        <div class="info-value">${task.reward * 30}+</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">预计用时</div>
                        <div class="info-value">${task.duration}天</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">剩余时间</div>
                        <div class="info-value">${daysLeft}天</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">技能要求</div>
                        <div class="info-value">${task.skills.join(', ')}</div>
                    </div>
                </div>
                
                <div class="task-detail-actions">
                    <button class="btn btn-primary" onclick="acceptTask(${task.id})">接取任务</button>
                </div>
            </div>
        `;
    }

    // 渲染用户任务槽位
    function renderUserTasks() {
        Object.keys(userTasks).forEach(slotId => {
            const slotElement = document.getElementById(slotId);
            if (!slotElement) return;
            
            const task = userTasks[slotId];
            
            if (!task) {
                // 空槽位
                slotElement.className = 'task-slot empty';
                slotElement.innerHTML = `
                    <div class="slot-header">
                        <div class="slot-title">任务槽位 ${slotId.replace('slot', '')}</div>
                        <div class="slot-status">空闲</div>
                    </div>
                    <div class="slot-content">
                        <div class="empty-slot-icon">➕</div>
                        <div class="empty-slot-text">点击接取新任务</div>
                    </div>
                `;
            } else {
                // 占用槽位
                const daysLeft = Math.ceil((task.deadline - new Date()) / (1000 * 60 * 60 * 24));
                const daysWorked = Math.ceil((new Date() - task.acceptedAt) / (1000 * 60 * 60 * 24));
                const progress = Math.min(95, (daysWorked / task.duration) * 100);
                
                slotElement.className = 'task-slot occupied';
                slotElement.innerHTML = `
                    <div class="slot-header">
                        <div class="slot-title">任务槽位 ${slotId.replace('slot', '')}</div>
                        <div class="slot-status">${getTaskStatusText(task.status)}</div>
                    </div>
                    <div class="slot-content">
                        <div class="slot-task-info">
                            <div class="slot-task-title">${task.title}</div>
                            <div class="slot-task-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${progress}%"></div>
                                </div>
                                <span>${Math.round(progress)}%</span>
                            </div>
                            <div class="slot-task-deadline">剩余 ${daysLeft} 天</div>
                        </div>
                    </div>
                    <div class="slot-actions">
                        <button class="slot-btn submit" onclick="submitTask('${slotId}')">提交</button>
                        <button class="slot-btn abandon" onclick="abandonTask('${slotId}')">放弃</button>
                    </div>
                `;
            }
        });
    }

    function getTaskStatusText(status) {
        const map = {
            'in_progress': '进行中',
            'submitted': '已提交',
            'reviewing': '审查中',
            'completed': '已完成'
        };
        return map[status] || status;
    }

    // 筛选任务
    function filterTasks() {
        const searchBox = document.querySelector('.search-box');
        const searchTerm = searchBox ? searchBox.value.toLowerCase() : '';
        
        return availableTasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchTerm) || 
                                task.description.toLowerCase().includes(searchTerm);
            
            // 应用其他筛选条件
            const activeTypeFilter = document.querySelector('.filter-btn[data-filter]:not([data-filter*="priority"]):not([data-filter*="reward"]).active')?.dataset.filter || 'all';
            const activePriorityFilter = document.querySelector('.filter-btn[data-filter*="priority"].active')?.dataset.filter || 'all-priority';
            const activeRewardFilter = document.querySelector('.filter-btn[data-filter*="reward"].active')?.dataset.filter || 'all-reward';
            
            const matchesType = activeTypeFilter === 'all' || task.type === activeTypeFilter;
            const matchesPriority = activePriorityFilter === 'all-priority' || task.priority === activePriorityFilter;
            
            let matchesReward = true;
            if (activeRewardFilter === 'low') {
                matchesReward = task.reward >= 1 && task.reward <= 3;
            } else if (activeRewardFilter === 'medium') {
                matchesReward = task.reward >= 4 && task.reward <= 6;
            } else if (activeRewardFilter === 'high') {
                matchesReward = task.reward >= 7 && task.reward <= 10;
            }
            
            return matchesSearch && matchesType && matchesPriority && matchesReward;
        });
    }

    // 筛选按钮事件处理
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // 获取当前筛选组
            const filterGroup = this.closest('.filter-group');
            const buttons = filterGroup.querySelectorAll('.filter-btn');
            
            // 移除同组其他按钮的激活状态
            buttons.forEach(b => b.classList.remove('active'));
            
            // 激活当前按钮
            this.classList.add('active');
            
            // 重新渲染任务列表
            renderAvailableTasks();
        });
    });

    // 搜索框事件处理
    const searchBox = document.querySelector('.search-box');
    if (searchBox) {
        searchBox.addEventListener('input', function() {
            renderAvailableTasks();
        });
    }

    // 初始化页面
    renderAvailableTasks();
    renderUserTasks();
    updateCharacterPanelTasks();
});

// 任务中心功能
class TaskCenter {
    constructor() {
        this.userProfile = null;
        this.taskData = null;
        this.filteredTasks = [];
        this.currentFilters = {
            type: '',
            priority: '',
            difficulty: ''
        };
        
        this.init();
    }

    init() {
        this.loadData();
        this.bindEvents();
        this.renderAll();
    }

    // 加载数据
    loadData() {
        this.userProfile = dataManager.getUserProfile();
        this.taskData = dataManager.getTaskData();
        this.filteredTasks = dataManager.getAvailableTasks();
    }

    // 绑定事件
    bindEvents() {
        // 新任务按钮
        document.getElementById('addTaskBtn').addEventListener('click', () => {
            this.showAddTaskModal();
        });

        // 关闭模态框
        document.getElementById('closeModal').addEventListener('click', () => {
            this.hideAddTaskModal();
        });

        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.hideAddTaskModal();
        });

        // 点击背景关闭模态框
        document.getElementById('addTaskModal').addEventListener('click', (e) => {
            if (e.target.id === 'addTaskModal') {
                this.hideAddTaskModal();
            }
        });

        // 任务表单提交
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createNewTask();
        });

        // 过滤器
        document.getElementById('typeFilter').addEventListener('change', (e) => {
            this.currentFilters.type = e.target.value;
            this.applyFilters();
        });

        document.getElementById('priorityFilter').addEventListener('change', (e) => {
            this.currentFilters.priority = e.target.value;
            this.applyFilters();
        });

        document.getElementById('difficultyFilter').addEventListener('change', (e) => {
            this.currentFilters.difficulty = e.target.value;
            this.applyFilters();
        });

        // 监听数据更新
        window.addEventListener('dataUpdate', (e) => {
            this.handleDataUpdate(e.detail);
        });
    }

    // 处理数据更新
    handleDataUpdate(detail) {
        if (detail.type === 'userProfile') {
            this.userProfile = detail.data;
            this.renderUserStats();
            this.renderMyTasks();
        } else if (detail.type === 'taskData') {
            this.taskData = detail.data;
            this.filteredTasks = dataManager.getAvailableTasks();
            this.applyFilters();
            this.renderMyTasks();
        }
    }

    // 渲染所有内容
    renderAll() {
        this.renderMyTasks();
        this.renderAvailableTasks();
        this.renderUserStats();
    }

    // 渲染我的任务
    renderMyTasks() {
        this.renderInProgressTasks();
        this.renderQueueTasks();
    }

    // 渲染进行中的任务
    renderInProgressTasks() {
        const container = document.getElementById('inProgressTasks');
        const countElement = document.getElementById('inProgressCount');
        
        const inProgressTasks = this.taskData.inProgress.filter(task => 
            task.assignee === this.userProfile.id
        );

        countElement.textContent = inProgressTasks.length;

        if (inProgressTasks.length === 0) {
            container.innerHTML = '<div class="empty-message">暂无进行中的任务</div>';
            return;
        }

        container.innerHTML = inProgressTasks.map(task => `
            <div class="my-task-card">
                <div class="my-task-title">${task.title}</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${task.progress}%"></div>
                </div>
                <div class="my-task-meta">
                    <span>${task.progress}% 完成</span>
                    <span>${formatTimeLeft(this.calculateDaysLeft(task.deadline))}</span>
                </div>
            </div>
        `).join('');
    }

    // 渲染排队中的任务
    renderQueueTasks() {
        const container = document.getElementById('queueTasks');
        const countElement = document.getElementById('queueCount');
        
        // 这里可以根据实际需求实现排队逻辑
        const queueTasks = [];
        countElement.textContent = queueTasks.length;

        if (queueTasks.length === 0) {
            container.innerHTML = '<div class="empty-message">暂无排队任务</div>';
            return;
        }

        container.innerHTML = queueTasks.map(task => `
            <div class="my-task-card">
                <div class="my-task-title">${task.title}</div>
                <div class="my-task-meta">
                    <span>排队中</span>
                    <span>第${task.queuePosition}位</span>
                </div>
            </div>
        `).join('');
    }

    // 渲染可接取任务
    renderAvailableTasks() {
        const container = document.getElementById('availableTasks');

        if (this.filteredTasks.length === 0) {
            container.innerHTML = `
                <div class="empty-message">
                    <i class="fas fa-search" style="font-size: 48px; color: #ddd; margin-bottom: 10px;"></i>
                    <p>没有找到符合条件的任务</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredTasks.map(task => this.renderTaskCard(task)).join('');

        // 绑定接取任务事件
        container.querySelectorAll('.take-task-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const taskId = btn.dataset.taskId;
                this.takeTask(taskId);
            });
        });
    }

    // 渲染单个任务卡片
    renderTaskCard(task) {
        const daysLeft = this.calculateDaysLeft(task.deadline);
        const timeLeftText = formatTimeLeft(daysLeft);
        const priorityClass = `${task.priority}-priority`;
        
        return `
            <div class="available-task-card ${priorityClass}">
                <div class="task-card-header">
                    <h3 class="task-title">${task.title}</h3>
                    <span class="task-type-badge ${task.type}">${getTypeLabel(task.type)}</span>
                </div>
                
                <div class="task-tags">
                    ${task.tags.map(tag => `<span class="task-tag">${tag}</span>`).join('')}
                </div>
                
                <p class="task-description">${task.description}</p>
                
                <div class="task-meta-row">
                    <div class="task-meta-left">
                        <div class="meta-item">
                            <i class="fas fa-layer-group"></i>
                            <span class="difficulty-label difficulty-${task.difficulty}">
                                ${getDifficultyLabel(task.difficulty)}
                            </span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-clock"></i>
                            <span>${task.estimatedTime}天</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-calendar-alt"></i>
                            <span class="${daysLeft < 0 ? 'text-danger' : daysLeft <= 1 ? 'text-warning' : ''}">${timeLeftText}</span>
                        </div>
                    </div>
                </div>
                
                <div class="task-actions">
                    <div class="task-reward">
                        <i class="fas fa-star"></i>
                        <span>${task.baseReward}经验</span>
                    </div>
                    <button class="take-task-btn" data-task-id="${task.id}" 
                            ${this.canTakeTask(task) ? '' : 'disabled'}>
                        ${this.canTakeTask(task) ? '接取任务' : '等级不足'}
                    </button>
                </div>
            </div>
        `;
    }

    // 渲染用户统计
    renderUserStats() {
        document.getElementById('completedCount').textContent = this.userProfile.stats.tasksCompleted;
        document.getElementById('successRate').textContent = this.userProfile.stats.successRate + '%';
        document.getElementById('streakCount').textContent = this.userProfile.stats.streakCount;
        document.getElementById('avgTime').textContent = this.userProfile.stats.avgCompletionTime + '天';

        // 令牌状态
        document.getElementById('normalTokens').textContent = this.userProfile.tokens.normal;
        document.getElementById('reviewTokens').textContent = this.userProfile.tokens.review;
        document.getElementById('reserveTokens').textContent = this.userProfile.tokens.reserve;
        document.getElementById('streakTokens').textContent = this.userProfile.tokens.streak;
    }

    // 应用过滤器
    applyFilters() {
        this.filteredTasks = dataManager.getAvailableTasks().filter(task => {
            if (this.currentFilters.type && task.type !== this.currentFilters.type) {
                return false;
            }
            if (this.currentFilters.priority && task.priority !== this.currentFilters.priority) {
                return false;
            }
            if (this.currentFilters.difficulty && task.difficulty !== this.currentFilters.difficulty) {
                return false;
            }
            return true;
        });

        this.renderAvailableTasks();
    }

    // 显示新任务模态框
    showAddTaskModal() {
        const modal = document.getElementById('addTaskModal');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // 隐藏新任务模态框
    hideAddTaskModal() {
        const modal = document.getElementById('addTaskModal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        this.resetTaskForm();
    }

    // 重置任务表单
    resetTaskForm() {
        document.getElementById('taskForm').reset();
    }

    // 创建新任务
    createNewTask() {
        const formData = new FormData(document.getElementById('taskForm'));
        const selectedSkills = Array.from(document.querySelectorAll('input[name="skills"]:checked'))
            .map(cb => cb.value);
        
        const tags = formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()) : [];

        const newTask = {
            title: formData.get('title'),
            description: formData.get('description'),
            type: formData.get('type'),
            priority: formData.get('priority'),
            difficulty: formData.get('difficulty'),
            baseReward: parseInt(formData.get('baseReward')),
            estimatedTime: parseInt(formData.get('estimatedTime')),
            deadline: parseInt(formData.get('deadline')),
            requiredLevel: parseInt(formData.get('requiredLevel')),
            skillRequirements: selectedSkills,
            tags: tags
        };

        // 验证表单
        if (!this.validateTaskForm(newTask)) {
            return;
        }

        // 添加任务
        const createdTask = dataManager.addTask(newTask);
        
        // 关闭模态框
        this.hideAddTaskModal();
        
        // 显示成功提示
        this.showNotification('任务创建成功！', 'success');
        
        // 刷新任务列表
        this.loadData();
        this.applyFilters();
    }

    // 验证任务表单
    validateTaskForm(task) {
        if (!task.title || task.title.trim() === '') {
            this.showNotification('请输入任务标题', 'error');
            return false;
        }

        if (!task.description || task.description.trim() === '') {
            this.showNotification('请输入任务描述', 'error');
            return false;
        }

        if (!task.type || !task.priority || !task.difficulty) {
            this.showNotification('请选择任务类型、优先级和难度', 'error');
            return false;
        }

        if (!task.baseReward || task.baseReward < 1 || task.baseReward > 20) {
            this.showNotification('基础奖励必须在1-20分之间', 'error');
            return false;
        }

        if (!task.estimatedTime || task.estimatedTime < 1 || task.estimatedTime > 30) {
            this.showNotification('预计用时必须在1-30天之间', 'error');
            return false;
        }

        if (!task.deadline || task.deadline < 1 || task.deadline > 90) {
            this.showNotification('截止时间必须在1-90天之间', 'error');
            return false;
        }

        if (task.requiredLevel < 0 || task.requiredLevel > 10) {
            this.showNotification('要求等级必须在0-10级之间', 'error');
            return false;
        }

        return true;
    }

    // 接取任务
    takeTask(taskId) {
        if (!this.canTakeTask(this.getTaskById(taskId))) {
            this.showNotification('等级不足，无法接取此任务', 'error');
            return;
        }

        // 检查是否有足够的令牌
        if (this.userProfile.tokens.normal <= 0) {
            this.showNotification('普通令牌不足，无法接取任务', 'error');
            return;
        }

        // 检查任务槽位
        if (this.userProfile.currentTasks.length >= 3) {
            this.showNotification('任务槽位已满，请先完成现有任务', 'error');
            return;
        }

        const task = dataManager.assignTask(taskId, this.userProfile.id);
        if (task) {
            // 消耗令牌
            this.userProfile.tokens.normal--;
            dataManager.updateUserProfile(this.userProfile);
            
            this.showNotification(`成功接取任务：${task.title}`, 'success');
            this.loadData();
            this.applyFilters();
        } else {
            this.showNotification('接取任务失败，任务可能已被他人接取', 'error');
        }
    }

    // 检查是否可以接取任务
    canTakeTask(task) {
        return task && this.userProfile.level >= task.requiredLevel;
    }

    // 根据ID获取任务
    getTaskById(taskId) {
        return this.filteredTasks.find(task => task.id === taskId);
    }

    // 计算剩余天数
    calculateDaysLeft(deadline) {
        const now = new Date();
        const deadlineDate = new Date(now.getTime() + deadline * 24 * 60 * 60 * 1000);
        const diffTime = deadlineDate - now;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // 显示通知
    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // 显示动画
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // 自动隐藏
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new TaskCenter();
});
 