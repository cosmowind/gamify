// 任务中心可视化类
class TaskCenterVisualizer {
    constructor() {
        this.tasks = [];
        this.developers = [];
        this.isSimulating = false;
        this.simulationSpeed = 1;
        this.currentTask = null;
        this.currentDeveloper = null;
        this.simulationInterval = null;
        
        this.init();
    }

    // 初始化
    init() {
        this.generateData();
        this.renderTasks();
        this.renderDevelopers();
        this.bindEvents();
        this.updateStats();
    }

    // 生成模拟数据
    generateData() {
        this.tasks = DataUtils.generateMockTasks(12);
        this.developers = DataUtils.generateMockDevelopers(8);
    }

    // 渲染任务列表
    renderTasks() {
        const container = document.getElementById('tasksContainer');
        if (!container) return;

        container.innerHTML = '';
        
        this.tasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            container.appendChild(taskElement);
        });
    }

    // 创建任务元素
    createTaskElement(task) {
        const div = document.createElement('div');
        div.className = `task-item priority-${task.priority}`;
        div.dataset.taskId = task.id;
        
        const difficultyText = {
            'simple': '简单',
            'standard': '标准', 
            'hard': '高难'
        };
        
        const urgencyText = {
            'relaxed': '不急',
            'standard': '标准',
            'critical': '紧急'
        };
        
        div.innerHTML = `
            <div class="task-title">${task.title}</div>
            <div class="task-meta">
                <span class="task-tag difficulty-${task.difficulty}">${difficultyText[task.difficulty]}</span>
                <span class="task-tag urgency-${task.urgency}">${urgencyText[task.urgency]}</span>
                <span class="task-tag">${task.estimatedTime}h</span>
                <span class="task-tag">${task.skills.join(', ')}</span>
            </div>
        `;
        
        // 添加点击事件
        div.addEventListener('click', () => {
            this.selectTask(task);
        });
        
        return div;
    }

    // 渲染开发者列表
    renderDevelopers() {
        const container = document.getElementById('developersContainer');
        if (!container) return;

        container.innerHTML = '';
        
        this.developers.forEach(developer => {
            const developerElement = this.createDeveloperElement(developer);
            container.appendChild(developerElement);
        });
    }

    // 创建开发者元素
    createDeveloperElement(developer) {
        const div = document.createElement('div');
        div.className = `developer-item level-${developer.level}`;
        div.dataset.developerId = developer.id;
        
        const levelText = {
            'newbie': '新手',
            'intermediate': '中手',
            'expert': '高手'
        };
        
        const icons = {
            'newbie': 'fa-user-graduate',
            'intermediate': 'fa-user-tie',
            'expert': 'fa-user-ninja'
        };
        
        div.innerHTML = `
            <div class="developer-name">
                <i class="fas ${icons[developer.level]}"></i>
                ${developer.name}
            </div>
            <div class="developer-meta">
                <span class="level-tag level-${developer.level}">${levelText[developer.level]}</span>
                <span class="task-tag">经验: ${developer.experience}</span>
                <span class="task-tag">疲劳: ${developer.fatigue}%</span>
                <span class="task-tag">队列: ${developer.queue}</span>
            </div>
        `;
        
        // 添加点击事件
        div.addEventListener('click', () => {
            this.selectDeveloper(developer);
        });
        
        return div;
    }

    // 绑定事件
    bindEvents() {
        // 模拟控制按钮
        const startBtn = document.getElementById('startSimulation');
        const pauseBtn = document.getElementById('pauseSimulation');
        const resetBtn = document.getElementById('resetSimulation');
        const speedSlider = document.getElementById('speedSlider');
        const speedDisplay = document.getElementById('speedDisplay');

        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startSimulation();
            });
        }

        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                this.pauseSimulation();
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetSimulation();
            });
        }

        if (speedSlider) {
            speedSlider.addEventListener('input', (e) => {
                this.simulationSpeed = parseFloat(e.target.value);
                if (speedDisplay) {
                    speedDisplay.textContent = `${this.simulationSpeed}x`;
                }
            });
        }
    }

    // 选择任务
    selectTask(task) {
        this.currentTask = task;
        
        // 高亮选中的任务
        document.querySelectorAll('.task-item').forEach(el => {
            el.classList.remove('selected');
        });
        document.querySelector(`[data-task-id="${task.id}"]`).classList.add('selected');
        
        // 显示任务详情
        this.displayTaskInfo(task);
        
        // 如果有选中的开发者，计算匹配度
        if (this.currentDeveloper) {
            this.calculateAndDisplayMatch();
        }
    }

    // 选择开发者
    selectDeveloper(developer) {
        this.currentDeveloper = developer;
        
        // 高亮选中的开发者
        document.querySelectorAll('.developer-item').forEach(el => {
            el.classList.remove('selected');
        });
        document.querySelector(`[data-developer-id="${developer.id}"]`).classList.add('selected');
        
        // 显示开发者详情
        this.displayDeveloperInfo(developer);
        
        // 如果有选中的任务，计算匹配度
        if (this.currentTask) {
            this.calculateAndDisplayMatch();
        }
    }

    // 显示任务信息
    displayTaskInfo(task) {
        const taskInfoElement = document.getElementById('taskInfo');
        if (!taskInfoElement) return;

        const difficultyText = {
            'simple': '简单',
            'standard': '标准', 
            'hard': '高难'
        };
        
        const urgencyText = {
            'relaxed': '不急',
            'standard': '标准',
            'critical': '紧急'
        };
        
        taskInfoElement.innerHTML = `
            <div><strong>任务名称:</strong> ${task.title}</div>
            <div><strong>优先级:</strong> ${task.priority === 'main' ? '主线' : task.priority === 'side' ? '支线' : '次要'}</div>
            <div><strong>难度等级:</strong> ${difficultyText[task.difficulty]}</div>
            <div><strong>紧急程度:</strong> ${urgencyText[task.urgency]}</div>
            <div><strong>预估时间:</strong> ${task.estimatedTime}小时</div>
            <div><strong>技能要求:</strong> ${task.skills.join(', ')}</div>
        `;
    }

    // 显示开发者信息
    displayDeveloperInfo(developer) {
        const developerInfoElement = document.getElementById('developerInfo');
        if (!developerInfoElement) return;

        const levelText = {
            'newbie': '新手',
            'intermediate': '中手',
            'expert': '高手'
        };
        
        developerInfoElement.innerHTML = `
            <div><strong>开发者:</strong> ${developer.name}</div>
            <div><strong>能力等级:</strong> ${levelText[developer.level]}</div>
            <div><strong>经验值:</strong> ${developer.experience}</div>
            <div><strong>疲劳值:</strong> ${developer.fatigue}%</div>
            <div><strong>当前任务:</strong> ${developer.currentTasks}个</div>
            <div><strong>排队任务:</strong> ${developer.queue}个</div>
            <div><strong>技能:</strong> ${developer.skills.join(', ')}</div>
        `;
    }

    // 计算并显示匹配度
    calculateAndDisplayMatch() {
        if (!this.currentTask || !this.currentDeveloper) return;

        const matchScore = DataUtils.calculateMatchScore(this.currentTask, this.currentDeveloper);
        const algorithmInfoElement = document.getElementById('algorithmInfo');
        
        if (algorithmInfoElement) {
            const percentage = Math.round(matchScore * 100);
            const matchLevel = percentage >= 80 ? '优秀' : percentage >= 60 ? '良好' : percentage >= 40 ? '一般' : '较差';
            
            algorithmInfoElement.innerHTML = `
                <div><strong>匹配度评分:</strong> ${percentage}% (${matchLevel})</div>
                <div><strong>技能匹配:</strong> ${this.calculateSkillMatch()}%</div>
                <div><strong>难度适配:</strong> ${this.getDifficultyMatch()}</div>
                <div><strong>工作负载:</strong> ${this.getWorkloadStatus()}</div>
                <div><strong>推荐指数:</strong> ${this.getRecommendationLevel(matchScore)}</div>
            `;
        }
    }

    // 计算技能匹配度
    calculateSkillMatch() {
        if (!this.currentTask || !this.currentDeveloper) return 0;
        
        const matchingSkills = this.currentTask.skills.filter(skill => 
            this.currentDeveloper.skills.includes(skill)
        );
        
        return Math.round((matchingSkills.length / this.currentTask.skills.length) * 100);
    }

    // 获取难度匹配说明
    getDifficultyMatch() {
        if (!this.currentTask || !this.currentDeveloper) return '';
        
        const matches = {
            'simple': {
                'newbie': '完美匹配',
                'intermediate': '能力过剩',
                'expert': '大材小用'
            },
            'standard': {
                'newbie': '具有挑战',
                'intermediate': '完美匹配',
                'expert': '轻松胜任'
            },
            'hard': {
                'newbie': '难度过高',
                'intermediate': '具有挑战',
                'expert': '完美匹配'
            }
        };
        
        return matches[this.currentTask.difficulty][this.currentDeveloper.level];
    }

    // 获取工作负载状态
    getWorkloadStatus() {
        if (!this.currentDeveloper) return '';
        
        const totalTasks = this.currentDeveloper.currentTasks + this.currentDeveloper.queue;
        const fatigue = this.currentDeveloper.fatigue;
        
        if (totalTasks >= 4 || fatigue > 60) return '负载较重';
        if (totalTasks >= 2 || fatigue > 30) return '负载适中';
        return '负载较轻';
    }

    // 获取推荐等级
    getRecommendationLevel(score) {
        if (score >= 0.8) return '⭐⭐⭐⭐⭐ 强烈推荐';
        if (score >= 0.6) return '⭐⭐⭐⭐ 推荐';
        if (score >= 0.4) return '⭐⭐⭐ 一般';
        if (score >= 0.2) return '⭐⭐ 不太适合';
        return '⭐ 不推荐';
    }

    // 开始模拟
    startSimulation() {
        if (this.isSimulating) return;
        
        this.isSimulating = true;
        this.simulationInterval = setInterval(() => {
            this.runSimulationStep();
        }, 3000 / this.simulationSpeed);
        
        // 更新按钮状态
        document.getElementById('startSimulation').disabled = true;
        document.getElementById('pauseSimulation').disabled = false;
    }

    // 暂停模拟
    pauseSimulation() {
        this.isSimulating = false;
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
            this.simulationInterval = null;
        }
        
        // 更新按钮状态
        document.getElementById('startSimulation').disabled = false;
        document.getElementById('pauseSimulation').disabled = true;
    }

    // 重置模拟
    resetSimulation() {
        this.pauseSimulation();
        this.generateData();
        this.renderTasks();
        this.renderDevelopers();
        this.updateStats();
        this.clearMatchDetails();
        this.resetAlgorithmSteps();
    }

    // 执行模拟步骤
    runSimulationStep() {
        if (this.tasks.length === 0) {
            this.pauseSimulation();
            return;
        }

        // 随机选择一个任务
        const randomTaskIndex = Math.floor(Math.random() * this.tasks.length);
        const task = this.tasks[randomTaskIndex];
        
        // 执行匹配算法动画
        this.animateAlgorithmSteps(task);
        
        setTimeout(() => {
            // 找到最佳匹配的开发者
            const bestDeveloper = this.findBestMatch(task);
            
            if (bestDeveloper) {
                this.animateTaskAssignment(task, bestDeveloper);
                
                // 从任务列表中移除
                this.tasks.splice(randomTaskIndex, 1);
                
                // 更新开发者状态
                bestDeveloper.currentTasks++;
                bestDeveloper.fatigue += Math.random() * 10;
                
                // 重新渲染
                this.renderTasks();
                this.renderDevelopers();
                this.updateStats();
            }
        }, 2000 / this.simulationSpeed);
    }

    // 动画显示算法步骤
    animateAlgorithmSteps(task) {
        const steps = document.querySelectorAll('.algorithm-step');
        const currentMatchElement = document.getElementById('currentMatch');
        
        // 重置步骤
        steps.forEach(step => step.classList.remove('active'));
        
        // 显示当前处理的任务
        if (currentMatchElement) {
            currentMatchElement.querySelector('.match-info').textContent = `正在匹配: ${task.title}`;
        }
        
        // 逐步激活算法步骤
        steps.forEach((step, index) => {
            setTimeout(() => {
                step.classList.add('active');
            }, (index + 1) * 300 / this.simulationSpeed);
        });
    }

    // 找到最佳匹配
    findBestMatch(task) {
        let bestDeveloper = null;
        let bestScore = 0;
        
        this.developers.forEach(developer => {
            // 检查开发者是否可用（负载不能太重）
            if (developer.currentTasks + developer.queue < 5 && developer.fatigue < 80) {
                const score = DataUtils.calculateMatchScore(task, developer);
                if (score > bestScore) {
                    bestScore = score;
                    bestDeveloper = developer;
                }
            }
        });
        
        return bestDeveloper;
    }

    // 动画显示任务分配
    animateTaskAssignment(task, developer) {
        // 高亮任务元素
        const taskElement = document.querySelector(`[data-task-id="${task.id}"]`);
        const developerElement = document.querySelector(`[data-developer-id="${developer.id}"]`);
        
        if (taskElement) {
            taskElement.classList.add('task-moving');
            
            setTimeout(() => {
                taskElement.remove();
            }, 2000 / this.simulationSpeed);
        }
        
        if (developerElement) {
            developerElement.classList.add('developer-receiving');
            
            setTimeout(() => {
                developerElement.classList.remove('developer-receiving');
            }, 1000 / this.simulationSpeed);
        }
        
        // 显示分配结果
        const currentMatchElement = document.getElementById('currentMatch');
        if (currentMatchElement) {
            const matchScore = DataUtils.calculateMatchScore(task, developer);
            currentMatchElement.querySelector('.match-info').innerHTML = `
                <div>✅ 分配成功!</div>
                <div>${task.title} → ${developer.name}</div>
                <div>匹配度: ${Math.round(matchScore * 100)}%</div>
            `;
            
            setTimeout(() => {
                currentMatchElement.querySelector('.match-info').textContent = '等待下一个任务...';
            }, 2000 / this.simulationSpeed);
        }
    }

    // 更新统计数据
    updateStats() {
        const totalTasksElement = document.getElementById('totalTasks');
        const totalDevelopersElement = document.getElementById('totalDevelopers');
        
        if (totalTasksElement) {
            totalTasksElement.textContent = this.tasks.length;
        }
        
        if (totalDevelopersElement) {
            const availableDevelopers = this.developers.filter(dev => 
                dev.currentTasks + dev.queue < 5 && dev.fatigue < 80
            ).length;
            totalDevelopersElement.textContent = availableDevelopers;
        }
        
        // 模拟其他统计数据的变化
        const avgMatchTimeElement = document.getElementById('avgMatchTime');
        const efficiencyElement = document.getElementById('efficiency');
        
        if (avgMatchTimeElement) {
            const newTime = (Math.random() * 2 + 1.5).toFixed(1);
            avgMatchTimeElement.textContent = newTime;
        }
        
        if (efficiencyElement) {
            const newEfficiency = Math.round(Math.random() * 10 + 90);
            efficiencyElement.textContent = newEfficiency + '%';
        }
    }

    // 清空匹配详情
    clearMatchDetails() {
        const taskInfo = document.getElementById('taskInfo');
        const developerInfo = document.getElementById('developerInfo');
        const algorithmInfo = document.getElementById('algorithmInfo');
        
        if (taskInfo) taskInfo.textContent = '等待选择任务...';
        if (developerInfo) developerInfo.textContent = '等待匹配开发者...';
        if (algorithmInfo) algorithmInfo.textContent = '等待计算...';
        
        this.currentTask = null;
        this.currentDeveloper = null;
        
        // 移除选中状态
        document.querySelectorAll('.task-item, .developer-item').forEach(el => {
            el.classList.remove('selected');
        });
    }

    // 重置算法步骤
    resetAlgorithmSteps() {
        document.querySelectorAll('.algorithm-step').forEach(step => {
            step.classList.remove('active');
        });
        
        const currentMatchElement = document.getElementById('currentMatch');
        if (currentMatchElement) {
            currentMatchElement.querySelector('.match-info').textContent = '等待任务...';
        }
    }
}

// 页面加载完成后初始化任务中心
document.addEventListener('DOMContentLoaded', () => {
    const taskCenter = new TaskCenterVisualizer();
    
    // 添加样式用于选中状态
    const style = document.createElement('style');
    style.textContent = `
        .task-item.selected,
        .developer-item.selected {
            background: rgba(102, 126, 234, 0.2) !important;
            transform: translateX(10px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3) !important;
        }
        
        .tooltip {
            position: absolute;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.9rem;
            z-index: 1000;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);
}); 