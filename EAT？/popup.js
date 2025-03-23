document.addEventListener('DOMContentLoaded', function() {
  // 彩蛋功能相关变量
  let clickCount = 0; // 记录连续点击次数
  let easterEggMode = false; // 厨神模式标志
  let secretModeActive = false; // 隐藏菜单模式标志
  let currentStyle = 'warm-style'; // 当前样式
  let currentMode = 'normal'; // 当前模式：normal, gain, lose
  
  // 特殊日期食物
  const specialDateFoods = {
    '01-01': { name: '饺子', description: '元旦快乐！' },
    '02-14': { name: '巧克力', description: '情人节快乐！' },
    '05-01': { name: '烧烤', description: '劳动节快乐！' },
    '10-01': { name: '月饼', description: '国庆节快乐！' },
    '12-25': { name: '火鸡', description: '圣诞节快乐！' }
  };
  
  // 稀有食物列表
  const rareFoods = [
    '松露意面', '和牛寿司', '鱼子酱', '鹅肝酱', '帝王蟹', '神户牛排',
    '金箔冰淇淋', '松露巧克力', '鲍鱼', '燕窝', '龙虾', '鱼翅'
  ];
  
  // 厨神模式食谱
  const chefModeRecipes = {
    '中餐': ['红烧狮子头', '佛跳墙', '东坡肉', '叫花鸡', '鱼香肉丝', '宫保鸡丁高级版'],
    '西餐': ['威灵顿牛排', '法式蜗牛', '龙虾汤', '鹅肝酱配吐司', '松露意面', '提拉米苏'],
    '粤菜': ['脆皮烧鹅', '白切鸡', '清蒸鲈鱼', '蚝皇凤爪', '叉烧酥', '杏仁豆腐花'],
    '湘菜': ['剁椒鱼头', '口味虾', '擂辣椒酱', '湘西外婆菜', '腊味合蒸', '糖醋排骨'],
    '川菜': ['麻婆豆腐', '鱼香肉丝', '宫保鸡丁', '水煮鱼', '回锅肉', '夫妻肺片'],
    '东北菜': ['锅包肉', '小鸡炖蘑菇', '猪肉炖粉条', '东北乱炖', '溜肉段', '拔丝地瓜'],
    '江浙菜': ['西湖醋鱼', '龙井虾仁', '东坡肉', '叫花鸡', '松鼠桂鱼', '梅干菜扣肉'],
    '日料': ['寿司拼盘', '刺身拼盘', '天妇罗', '照烧鸡', '寿喜烧', '味增汤'],
    '韩餐': ['韩式烤肉', '石锅拌饭', '部队锅', '泡菜汤', '辣炒年糕', '海鲜煎饼'],
    '快餐': ['黑椒牛柳', '蜜汁鸡翅', '芝士汉堡', '培根披萨', '奶油意面', '香辣鸡腿堡'],
    '健康食品': ['藜麦沙拉', '牛油果三明治', '蔬菜杂粮粥', '水果沙拉', '蒸鸡胸肉', '烤三文鱼']
  };
  
  // 增肥食物列表
  const gainWeightFoods = {
    '中餐': ['红烧肉', '东坡肉', '糖醋排骨', '可乐鸡翅', '锅包肉', '大盘鸡', '烤鸭', '炸酱面', '羊肉泡馍', '麻辣香锅'],
    '西餐': ['牛排', '奶酪焗饭', '培根意面', '芝士汉堡', '披萨', '炸鸡', '薯条', '奶油蘑菇汤', '芝士蛋糕', '提拉米苏'],
    '粤菜': ['烧鹅', '叉烧', '煲仔饭', '咸鱼茄子煲', '干炒牛河', '咕噜肉', '椒盐濑尿虾', '荷叶糯米鸡', '蚝油牛肉', '豉汁蒸排骨'],
    '湘菜': ['剁椒鱼头', '口味虾', '辣椒炒肉', '湘西外婆菜', '腊味合蒸', '糖醋排骨', '香辣田螺', '爆炒田螺', '麻辣小龙虾', '香干炒肉'],
    '川菜': ['麻婆豆腐', '回锅肉', '宫保鸡丁', '水煮鱼', '水煮牛肉', '辣子鸡', '夫妻肺片', '毛血旺', '麻辣香锅', '担担面'],
    '东北菜': ['锅包肉', '小鸡炖蘑菇', '猪肉炖粉条', '东北乱炖', '溜肉段', '拔丝地瓜', '酱骨头', '扒白菜', '猪肉炖粉条', '小鸡炖蘑菇'],
    '江浙菜': ['东坡肉', '糖醋排骨', '梅干菜扣肉', '腌笃鲜', '响油鳝糊', '清蒸河蟹', '蟹黄汤包', '阳春面', '鳝丝面', '小笼包'],
    '日料': ['天妇罗', '照烧鸡', '亲子丼', '牛丼', '猪排饭', '咖喱饭', '章鱼烧', '大阪烧', '寿喜烧', '炸猪排'],
    '韩餐': ['烤肉', '石锅拌饭', '部队锅', '辣炒年糕', '海鲜煎饼', '泡菜炒饭', '炸鸡', '烤五花肉', '烤牛肉', '烤鸡'],
    '快餐': ['汉堡', '炸鸡', '薯条', '披萨', '热狗', '三明治', '炒饭', '炒面', '盖浇饭', '麻辣烫'],
    '健康食品': ['炸鸡', '薯条', '汉堡', '披萨', '可乐', '奶茶', '冰淇淋', '巧克力', '蛋糕', '甜甜圈']
  };
  
  // 减肥食物列表
  const loseWeightFoods = {
    '中餐': ['清蒸鱼', '白灼虾', '凉拌黄瓜', '番茄蛋汤', '蒸鸡胸肉', '清炒时蔬', '冬瓜汤', '白灼菜心', '蒸蛋', '凉拌豆腐'],
    '西餐': ['蔬菜沙拉', '水煮鸡胸肉', '烤三文鱼', '藜麦饭', '蔬菜汤', '牛油果三明治', '蒸蔬菜', '烤鸡胸', '蔬菜杂粮粥', '水果沙拉'],
    '粤菜': ['白切鸡', '清蒸鲈鱼', '蚝油生菜', '白灼虾', '清蒸蟹', '蒸排骨', '蒸鱼', '艇仔粥', '白灼菜心', '清炒菜心'],
    '湘菜': ['清蒸鱼头', '凉拌黄瓜', '蒸排骨', '清炒时蔬', '白灼虾', '蒸鸡', '冬瓜汤', '番茄蛋汤', '清蒸豆腐', '凉拌海带'],
    '川菜': ['水煮鱼片', '清炒时蔬', '酸辣白菜', '蒸鸡', '冬瓜汤', '番茄蛋汤', '白灼菜心', '凉拌黄瓜', '清蒸豆腐', '白灼虾'],
    '东北菜': ['清炒时蔬', '白灼菜心', '蒸鱼', '冬瓜汤', '番茄蛋汤', '清蒸豆腐', '白灼虾', '蒸鸡', '凉拌黄瓜', '清蒸排骨'],
    '江浙菜': ['清蒸鲈鱼', '白灼虾', '清炒时蔬', '冬瓜汤', '番茄蛋汤', '清蒸豆腐', '白灼菜心', '蒸鸡', '凉拌黄瓜', '清蒸排骨'],
    '日料': ['刺身', '寿司', '清酒蒸鱼', '味增汤', '冷豆腐', '凉拌海带', '烤三文鱼', '茶碗蒸', '凉拌黄瓜', '清蒸豆腐'],
    '韩餐': ['拌杂菜', '海鲜豆腐汤', '凉拌海带', '烤三文鱼', '凉拌黄瓜', '清蒸豆腐', '白灼虾', '蒸鸡', '冬瓜汤', '番茄蛋汤'],
    '快餐': ['蔬菜沙拉', '水煮鸡胸肉', '烤三文鱼', '藜麦饭', '蔬菜汤', '牛油果三明治', '蒸蔬菜', '烤鸡胸', '蔬菜杂粮粥', '水果沙拉'],
    '健康食品': ['藜麦沙拉', '牛油果三明治', '蔬菜杂粮粥', '水果沙拉', '蒸鸡胸肉', '烤三文鱼', '蔬菜汤', '蒸蔬菜', '烤鸡胸', '蔬菜杂粮粥']
  };
  
  // 时间段推荐
  const timeRecommendations = {
    '早上': {
      '中餐': '包子、豆浆、油条、馄饨、粥',
      '西餐': '三明治、麦片、吐司、煎蛋、牛奶',
      '粤菜': '肠粉、虾饺、烧麦、粥、油条',
      '湘菜': '米粉、豆浆、糯米粑粑、热干面',
      '川菜': '担担面、抄手、豆花、凉粉',
      '东北菜': '大饼、豆浆、小豆粥、煎饼',
      '江浙菜': '小笼包、豆浆、粢饭团、油条',
      '日料': '味增汤、饭团、纳豆、烤鱼',
      '韩餐': '紫菜包饭、大酱汤、泡菜、米饭',
      '快餐': '豆浆、油条、煎饼果子、包子',
      '健康食品': '甜甜圈、奶茶、巧克力、冰淇淋、蛋糕'
    },
    '中午': {
      '中餐': '回锅肉、宫保鸡丁、鱼香肉丝、红烧肉',
      '西餐': '牛排、意面、披萨、汉堡',
      '粤菜': '烧鹅、叉烧、白切鸡、煲仔饭',
      '湘菜': '剁椒鱼头、辣椒炒肉、口味虾',
      '川菜': '麻婆豆腐、水煮鱼、回锅肉',
      '东北菜': '锅包肉、地三鲜、小鸡炖蘑菇',
      '江浙菜': '东坡肉、西湖醋鱼、龙井虾仁',
      '日料': '寿司、刺身、天妇罗、拉面',
      '韩餐': '石锅拌饭、烤肉、部队锅',
      '快餐': '汉堡、炸鸡、盖浇饭、炒饭',
      '健康食品': '沙拉、水煮鸡胸肉、藜麦饭、蔬菜汤、牛油果三明治'
    },
    '晚上': {
      '中餐': '火锅、烤鱼、烧烤、干锅',
      '西餐': '牛排、意面、披萨、沙拉',
      '粤菜': '蒸鱼、白切鸡、烧鹅、煲汤',
      '湘菜': '剁椒鱼头、辣椒炒肉、小炒黄牛肉',
      '川菜': '水煮鱼、麻辣香锅、辣子鸡',
      '东北菜': '猪肉炖粉条、小鸡炖蘑菇、锅包肉',
      '江浙菜': '西湖醋鱼、东坡肉、梅干菜扣肉',
      '日料': '寿司、刺身、火锅、烤肉',
      '韩餐': '烤肉、部队锅、泡菜汤',
      '快餐': '炒饭、炒面、盖浇饭、麻辣烫',
      '健康食品': '披萨、炸鸡、奶茶、冰淇淋、巧克力'
    },
    '夜宵': {
      '中餐': '烧烤、麻辣烫、火锅、炒饭',
      '西餐': '披萨、汉堡、薯条、三明治',
      '粤菜': '煲仔饭、粥、云吞面、烧腊',
      '湘菜': '口味虾、辣椒炒肉、臭豆腐',
      '川菜': '麻辣香锅、冒菜、串串香',
      '东北菜': '烧烤、炖菜、锅包肉',
      '江浙菜': '小笼包、生煎、锅贴、面条',
      '日料': '拉面、烧鸟、章鱼烧、关东煮',
      '韩餐': '部队锅、辣炒年糕、炸鸡、烤肉',
      '快餐': '炸鸡、汉堡、麻辣烫、烤冷面',
      '健康食品': '水果沙拉、酸奶、坚果、全麦三明治、蔬菜汁'
    }
  };
  
  // 获取DOM元素
  const cuisineButtons = document.querySelectorAll('.cuisine-btn');
  const timeRecommendationEl = document.getElementById('time-recommendation');
  const foodNameEl = document.getElementById('food-name');
  const decideBtn = document.getElementById('decide-btn');
  const foodDisplay = document.querySelector('.food-display');
  const styleToggleBtn = document.getElementById('style-toggle');
  const normalModeBtn = document.getElementById('normal-mode');
  const gainModeBtn = document.getElementById('gain-mode');
  const loseModeBtn = document.getElementById('lose-mode');
  const modeButtons = document.querySelectorAll('.mode-btn');
  
  // 当前选中的菜系
  let currentCuisine = '中餐';
  
  // 获取当前时间段
  function getCurrentTimePeriod() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) {
      return '早上';
    } else if (hour >= 10 && hour < 15) {
      return '中午';
    } else if (hour >= 15 && hour < 21) {
      return '晚上';
    } else if (hour >= 21 || hour < 2) {
      return '夜宵';
    } else {
      // 深夜彩蛋时间段 (2点到5点)
      return '深夜';
    }
  }
  
  // 更新时间推荐
  function updateTimeRecommendation() {
    const now = new Date();
    const timePeriod = getCurrentTimePeriod();
    
    // 检查是否是特殊日期（彩蛋）
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateKey = `${month}-${day}`;
    
    if (specialDateFoods[dateKey]) {
      const specialFood = specialDateFoods[dateKey];
      timeRecommendationEl.textContent = `${specialFood.description} 今天推荐：${specialFood.name}`;
      timeRecommendationEl.style.backgroundColor = '#FFD700';
      setTimeout(() => {
        timeRecommendationEl.style.backgroundColor = '#FFDAB9';
      }, 3000);
      return;
    }
    
    // 深夜彩蛋
    if (timePeriod === '深夜') {
      const funnyRecommendations = [
        '这个点了就别吃了，睡觉吧！', 
        '深夜彩蛋：一杯热牛奶，助你好梦！',
        '深夜彩蛋：数羊比数食物更有用！',
        '深夜彩蛋：饿着睡，明天瘦一斤！',
        '深夜彩蛋：梦里啥都有，何必现在吃！'
      ];
      const randomIndex = Math.floor(Math.random() * funnyRecommendations.length);
      timeRecommendationEl.textContent = funnyRecommendations[randomIndex];
      return;
    }
    
    // 厨神模式彩蛋
    if (easterEggMode && chefModeRecipes[currentCuisine]) {
      const chefRecipes = chefModeRecipes[currentCuisine];
      if (chefRecipes && chefRecipes.length > 0) {
        const randomRecipe = chefRecipes[Math.floor(Math.random() * chefRecipes.length)];
        timeRecommendationEl.textContent = `👨‍🍳 厨神模式：推荐尝试制作 ${randomRecipe}`;
        return;
      }
    }
    
    // 根据当前模式提供不同的推荐
    let recommendation = timeRecommendations[timePeriod]?.[currentCuisine] || '随便吃点啥';
    let modePrefix = '';
    
    if (currentMode === 'gain') {
      modePrefix = '【增肥模式】';
      if (gainWeightFoods[currentCuisine] && gainWeightFoods[currentCuisine].length > 0) {
        const randomGainFoods = gainWeightFoods[currentCuisine].slice(0, 3);
        recommendation = randomGainFoods.join('、');
      }
    } else if (currentMode === 'lose') {
      modePrefix = '【减肥模式】';
      if (loseWeightFoods[currentCuisine] && loseWeightFoods[currentCuisine].length > 0) {
        const randomLoseFoods = loseWeightFoods[currentCuisine].slice(0, 3);
        recommendation = randomLoseFoods.join('、');
      }
    }
    
    timeRecommendationEl.textContent = `${modePrefix}现在是${timePeriod}，推荐吃${recommendation}`;
  }
  
  // 初始化样式
  document.body.classList.add(currentStyle);
  
  // 更新元素样式函数
  function updateElementsStyle() {
    // 根据当前风格更新标题和按钮样式
    const foodNameEl = document.getElementById('food-name');
    
    // 更新食物名称颜色
    if (currentStyle === 'warm-style') {
      foodNameEl.style.color = '#FF4500';
    } else if (currentStyle === 'cool-style') {
      foodNameEl.style.color = '#4682B4';
    } else if (currentStyle === 'cute-style') {
      foodNameEl.style.color = '#FF69B4';
    }
  }
  
  // 初始化元素样式
  updateElementsStyle();
  
  // 初始化时间推荐
  updateTimeRecommendation();
  
  // 菜系按钮点击事件
  cuisineButtons.forEach(button => {
    button.addEventListener('click', function() {
      // 移除所有按钮的active类
      cuisineButtons.forEach(btn => btn.classList.remove('active'));
      // 给当前按钮添加active类
      this.classList.add('active');
      // 更新当前菜系
      currentCuisine = this.getAttribute('data-cuisine');
      // 更新时间推荐
      updateTimeRecommendation();
    });
  });
  
  // 样式切换按钮点击事件
  styleToggleBtn.addEventListener('click', function() {
    // 在三种样式之间循环切换
    if (currentStyle === 'warm-style') {
      currentStyle = 'cool-style';
      document.body.classList.remove('warm-style');
      document.body.classList.add('cool-style');
    } else if (currentStyle === 'cool-style') {
      currentStyle = 'cute-style';
      document.body.classList.remove('cool-style');
      document.body.classList.add('cute-style');
    } else {
      currentStyle = 'warm-style';
      document.body.classList.remove('cute-style');
      document.body.classList.add('warm-style');
    }
    
    // 显示样式切换提示
    showEasterEggNotification(`已切换到${currentStyle === 'warm-style' ? '暖色' : currentStyle === 'cool-style' ? '冷色' : '可爱'}风格`);
    
    // 更新标题和按钮样式
    updateElementsStyle();
  });
  
  // 模式切换按钮点击事件
  modeButtons.forEach(button => {
    button.addEventListener('click', function() {
      // 移除所有按钮的active类
      modeButtons.forEach(btn => btn.classList.remove('active'));
      // 给当前按钮添加active类
      this.classList.add('active');
      
      // 更新当前模式
      const modeId = this.id;
      if (modeId === 'normal-mode') {
        currentMode = 'normal';
      } else if (modeId === 'gain-mode') {
        currentMode = 'gain';
      } else if (modeId === 'lose-mode') {
        currentMode = 'lose';
      }
      
      // 显示模式切换提示
      let modeText = '';
      if (currentMode === 'normal') {
        modeText = '正常';
      } else if (currentMode === 'gain') {
        modeText = '增肥';
      } else if (currentMode === 'lose') {
        modeText = '减肥';
      }
      
      showEasterEggNotification(`已切换到${modeText}模式`);
      
      // 更新时间推荐
      updateTimeRecommendation();
    });
  });
  
  // 创建礼花效果
  function createConfetti() {
    const colors = ['#FF8C00', '#FF6347', '#FFD700', '#FF69B4', '#00CED1', '#9370DB'];
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDuration = (Math.random() * 2 + 1) + 's';
      confetti.style.animationDelay = (Math.random() * 0.5) + 's';
      
      foodDisplay.appendChild(confetti);
      
      // 动画结束后移除礼花元素
      setTimeout(() => {
        confetti.remove();
      }, 3000);
    }
  }
  
  // 随机选择食物
  function selectRandomFood() {
    // 稀有食物彩蛋 (1%概率)
    if (Math.random() < 0.01) {
      const rareFood = rareFoods[Math.floor(Math.random() * rareFoods.length)];
      return `✨ ${rareFood} ✨`;
    }
    
    // 根据当前模式选择食物列表
    let foodList;
    if (currentMode === 'gain') {
      foodList = gainWeightFoods[currentCuisine];
    } else if (currentMode === 'lose') {
      foodList = loseWeightFoods[currentCuisine];
    } else {
      foodList = foodData[currentCuisine];
    }
    
    // 隐藏菜单模式（连续点击彩蛋）
    if (secretModeActive) {
      const allFoods = [];
      Object.values(foodData).forEach(foods => {
        allFoods.push(...foods);
      });
      return allFoods[Math.floor(Math.random() * allFoods.length)];
    }
    
    // 厨神模式
    if (easterEggMode && chefModeRecipes[currentCuisine]) {
      const chefRecipes = chefModeRecipes[currentCuisine];
      if (chefRecipes && chefRecipes.length > 0) {
        return chefRecipes[Math.floor(Math.random() * chefRecipes.length)];
      }
    }
    
    // 常规食物
    const foods = foodData[currentCuisine];
    const randomIndex = Math.floor(Math.random() * foods.length);
    return foods[randomIndex];
  }
  
  // 食物选择动画
  function foodSelectionAnimation() {
    let counter = 0;
    const maxIterations = 20; // 动画迭代次数
    const interval = 100; // 每次变化的间隔时间(毫秒)
    let animationInterval;
    
    // 禁用按钮，防止动画过程中重复点击
    decideBtn.disabled = true;
    
    // 开始动画
    animationInterval = setInterval(() => {
      // 随机选择一个食物显示
      foodNameEl.textContent = selectRandomFood();
      counter++;
      
      // 动画结束
      if (counter >= maxIterations) {
        clearInterval(animationInterval);
        // 最终选择
        const finalFood = selectRandomFood();
        foodNameEl.textContent = finalFood;
        // 创建礼花效果
        createConfetti();
        // 重新启用按钮
        decideBtn.disabled = false;
      }
    }, interval);
  }
  
  // 创建特殊礼花效果（厨神模式彩蛋）
  function createSpecialConfetti() {
    const colors = ['#FFD700', '#FF1493', '#00FFFF', '#FF4500', '#9400D3', '#32CD32'];
    
    // 创建更多、更大、更闪亮的礼花
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.width = (Math.random() * 15 + 5) + 'px';
      confetti.style.height = (Math.random() * 15 + 5) + 'px';
      confetti.style.animationDuration = (Math.random() * 3 + 1) + 's';
      confetti.style.animationDelay = (Math.random() * 0.5) + 's';
      
      foodDisplay.appendChild(confetti);
      
      // 动画结束后移除礼花元素
      setTimeout(() => {
        confetti.remove();
      }, 4000);
    }
  }
  
  // 显示彩蛋提示
  function showEasterEggNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'absolute';
    notification.style.bottom = '10px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = 'rgba(255, 215, 0, 0.9)';
    notification.style.color = '#8B4513';
    notification.style.padding = '8px 15px';
    notification.style.borderRadius = '20px';
    notification.style.fontWeight = 'bold';
    notification.style.zIndex = '1000';
    notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.5s';
      setTimeout(() => {
        notification.remove();
      }, 500);
    }, 3000);
  }
  
  // 决定按钮点击事件
  decideBtn.addEventListener('click', function() {
    // 连续点击彩蛋
    clickCount++;
    
    // 连续点击10次触发隐藏菜单
    if (clickCount === 10 && !secretModeActive) {
      secretModeActive = true;
      showEasterEggNotification('🎉 解锁隐藏菜单！现在可以随机推荐所有菜系的食物');
      decideBtn.style.backgroundColor = '#9370DB';
      setTimeout(() => {
        decideBtn.style.backgroundColor = '#FF6347';
      }, 3000);
    }
    
    // 连续点击20次触发厨神模式
    if (clickCount === 20 && !easterEggMode) {
      easterEggMode = true;
      showEasterEggNotification('🔥 解锁厨神模式！尝试制作高级料理吧');
      createSpecialConfetti();
      document.body.style.backgroundColor = '#FFF0D4';
      setTimeout(() => {
        document.body.style.backgroundColor = '#FFF5E6';
      }, 3000);
      updateTimeRecommendation();
    }
    
    // 重置连续点击（如果间隔超过2秒）
    setTimeout(() => {
      clickCount = 0;
    }, 2000);
    
    // 开始食物选择动画
    foodSelectionAnimation();
  });
});

// 定义foodData变量
const foodData = {
  '中餐': ['红烧肉', '宫保鸡丁', '鱼香肉丝', '麻婆豆腐', '水煮鱼', '回锅肉', '糖醋排骨', '东坡肉', '小炒肉', '酸菜鱼'],
  '西餐': ['牛排', '意面', '披萨', '汉堡', '三明治', '沙拉', '烤鸡', '奶酪焗饭', '培根卷', '薯条'],
  '粤菜': ['烧鹅', '叉烧', '白切鸡', '煲仔饭', '肠粉', '虾饺', '烧麦', '云吞面', '蒸鱼', '咕噜肉'],
  '湘菜': ['剁椒鱼头', '口味虾', '辣椒炒肉', '湘西外婆菜', '腊味合蒸', '糖醋排骨', '香辣田螺', '爆炒田螺', '麻辣小龙虾', '香干炒肉'],
  '川菜': ['麻婆豆腐', '回锅肉', '宫保鸡丁', '水煮鱼', '水煮牛肉', '辣子鸡', '夫妻肺片', '毛血旺', '麻辣香锅', '担担面'],
  '东北菜': ['锅包肉', '小鸡炖蘑菇', '猪肉炖粉条', '东北乱炖', '溜肉段', '拔丝地瓜', '酱骨头', '扒白菜', '猪肉炖粉条', '小鸡炖蘑菇'],
  '江浙菜': ['东坡肉', '西湖醋鱼', '龙井虾仁', '叫花鸡', '松鼠桂鱼', '梅干菜扣肉', '腌笃鲜', '响油鳝糊', '清蒸河蟹', '蟹黄汤包'],
  '日料': ['寿司', '刺身', '天妇罗', '拉面', '照烧鸡', '亲子丼', '牛丼', '猪排饭', '咖喱饭', '章鱼烧'],
  '韩餐': ['烤肉', '石锅拌饭', '部队锅', '辣炒年糕', '海鲜煎饼', '泡菜炒饭', '炸鸡', '烤五花肉', '烤牛肉', '烤鸡'],
  '快餐': ['汉堡', '炸鸡', '薯条', '披萨', '热狗', '三明治', '炒饭', '炒面', '盖浇饭', '麻辣烫'],
  '健康食品': ['藜麦沙拉', '牛油果三明治', '蔬菜杂粮粥', '水果沙拉', '蒸鸡胸肉', '烤三文鱼', '蔬菜汤', '蒸蔬菜', '烤鸡胸', '蔬菜杂粮粥']
};