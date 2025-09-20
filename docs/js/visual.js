class VisualEnhancer {
  constructor() {
    this.cards = [...document.querySelectorAll('.interactive-card')];
    this.initScene();
  }

  initScene() {
    // 添加三维透视变换
    this.cards.forEach(card => {
      card.style.transformStyle = 'preserve-3d';
      card.querySelector('.card-content').style.transform = 'translateZ(30px)';
    });

    // 陀螺仪联动效果
    window.addEventListener('deviceorientation', (e) => {
      this.cards.forEach(card => {
        card.style.transform = `
          rotateX(${e.beta * 0.2}deg)
          rotateY(${e.gamma * 0.2}deg)
        `;
      });
    });
  }
}

// 动态加载条件检测
if (CSS.supports('transform-style', 'preserve-3d')) {
  new VisualEnhancer();
}