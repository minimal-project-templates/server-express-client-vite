export function renderStars1() {
  const canvas = document.getElementById("starCanvas") as HTMLCanvasElement
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const stars: any[] = [];
  const maxStars = 3;

  class Star {
    private x: number
    private y: number
    private radius: number
    private dy: number
    private dx: number
    private flicker: number
    private color: string

    constructor() {
      this.init();
    }

    init() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.radius = Math.random() * 2 + 1;
      this.color = `rgba(40, 0, 40, ${Math.random()})`;
      this.dy = Math.random() * 1 + 0.5;
      this.dx = (Math.random() - 0.5) * 2;
      this.flicker = Math.random() * 0.1 + 0.05;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = Math.random() * 15;
      ctx.shadowColor = "purple";
      ctx.fill();
    }

    update() {
      this.y += this.dy;
      this.x += this.dx;

      if (this.y > canvas.height) {
        this.init();
        this.y = 0;
      }

      if (this.x > canvas.width || this.x < 0) {
        this.init();
        this.y = Math.random() * canvas.height;
      }

      this.radius += Math.sin(this.flicker) * 0.1;
      this.flicker += 0.1;

      this.draw();
    }
  }

  function init() {
    for (let i = 0; i < maxStars; i++) {
      stars.push(new Star());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach((star) => star.update());
    requestAnimationFrame(animate);
  }

  init();
  animate();

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

export function renderStars2() {
  const canvas = document.getElementById("shootingStarsCanvas") as HTMLCanvasElement
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  class ShootingStar {
    private x: number
    private y: number
    private length: number
    private speed: number
    private angle: number
    private opacity: number
    private fade: number

    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height * 0.5;
      this.length = Math.random() * 80 + 10;
      this.speed = Math.random() * 5 + 2;
      this.angle = Math.random() * 60 + 20;
      this.opacity = Math.random() * 0.8 + 0.2;
      this.fade = 0.005;
    }

    draw() {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(
        this.x - this.length * Math.cos((this.angle * Math.PI) / 180),
        this.y + this.length * Math.sin((this.angle * Math.PI) / 180)
      );
      ctx.strokeStyle = `rgba(130, 0, 140, ${this.opacity})`;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();
    }

    update() {
      this.x -= this.speed * Math.cos((this.angle * Math.PI) / 180);
      this.y += this.speed * Math.sin((this.angle * Math.PI) / 180);
      this.opacity -= this.fade;

      if (this.opacity <= 0) {
        this.reset();
      }
    }
  }

  const stars: ShootingStar[] = [];
  for (let i = 0; i < 2; i++) {
    stars.push(new ShootingStar());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach((star) => {
      star.draw();
      star.update();
    });
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}