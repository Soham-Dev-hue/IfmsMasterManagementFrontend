import { Component, OnInit, OnDestroy, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

@Component({
  selector: 'app-page-not-found',
  template: `
    <div class="not-found-container">
      <div #threeContainer class="three-container"></div>
      <div class="content-overlay">
        <h1>404</h1>
        <h2>Oops! Lost in Space</h2>
        <p>The page you're looking for has drifted into the cosmic void.</p>
        <button (click)="navigate()" class="home-button">Beam Me Home</button>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      position: relative;
      width: 100%;
      height: 100vh;
      overflow: hidden;
      background: #000;
    }

    .three-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .content-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: white;
      font-family: 'Poppins', sans-serif;
      z-index: 10;
      pointer-events: none;
    }

    h1 {
      font-size: 8rem;
      font-weight: 700;
      margin: 0;
      text-shadow: 0 0 20px rgba(100, 200, 255, 0.7);
      animation: pulse 2s infinite alternate;
    }

    h2 {
      font-size: 2.5rem;
      font-weight: 600;
      margin: 10px 0;
      text-shadow: 0 0 10px rgba(100, 200, 255, 0.5);
    }

    p {
      font-size: 1.2rem;
      max-width: 600px;
      margin: 10px 20px;
      line-height: 1.5;
      opacity: 0.9;
    }

    .home-button {
      margin-top: 30px;
      padding: 15px 30px;
      background: rgba(0, 150, 255, 0.7);
      color: white;
      font-size: 1.1rem;
      font-weight: 600;
      border: none;
      border-radius: 30px;
      cursor: pointer;
      transition: all 0.3s ease;
      pointer-events: auto;
      backdrop-filter: blur(5px);
      box-shadow: 0 0 20px rgba(0, 150, 255, 0.5);
      animation: float 3s ease-in-out infinite;
    }

    .home-button:hover {
      background: rgba(0, 200, 255, 0.9);
      transform: scale(1.05);
      box-shadow: 0 0 30px rgba(0, 200, 255, 0.8);
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      100% { transform: scale(1.05); }
    }

    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
  `]
})
export class PageNotFoundComponent implements AfterViewInit, OnDestroy {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private composer!: EffectComposer;
  private clock = new THREE.Clock();
  private mixers: THREE.AnimationMixer[] = [];
  private animationId!: number;
  private stars!: THREE.Points;
  private nebula!: THREE.Mesh;

  constructor(private router: Router, private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.initThreeJS();
    this.setupCamera();
    this.setupRenderer();
    this.setupControls();
    this.setupEffects();
    this.createScene();
    this.animate();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    this.renderer.dispose();
    if (this.controls) this.controls.dispose();
    window.removeEventListener('resize', this.onWindowResize);
  }

  private initThreeJS(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
  }

  private setupCamera(): void {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 30;
    this.camera.position.y = 5;
  }

  private setupRenderer(): void {
    const container = this.el.nativeElement.querySelector('.three-container');
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    container.appendChild(this.renderer.domElement);

    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private setupControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.maxPolarAngle = Math.PI;
    this.controls.minPolarAngle = 0;
    this.controls.maxAzimuthAngle = Math.PI / 2;
    this.controls.minAzimuthAngle = -Math.PI / 2;
    this.controls.enableZoom = false;
  }

  private setupEffects(): void {
    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5, 0.4, 0.85
    );
    bloomPass.threshold = 0;
    bloomPass.strength = 1.5;
    bloomPass.radius = 0.5;
    this.composer.addPass(bloomPass);

    const fxaaPass = new ShaderPass(FXAAShader);
    fxaaPass.material.uniforms['resolution'].value.set(
      1 / window.innerWidth,
      1 / window.innerHeight
    );
    this.composer.addPass(fxaaPass);
  }

  private createScene(): void {
    this.addStars();
    this.addNebula();
    this.addFloating404();
  }

  private addStars(): void {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.2,
      transparent: true,
      opacity: 0.8
    });

    const starVertices = [];
    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starVertices.push(x, y, z);
    }

    starGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(starVertices, 3)
    );

    this.stars = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(this.stars);
  }

  private addNebula(): void {
    const nebulaGeometry = new THREE.SphereGeometry(15, 32, 32);
    const nebulaMaterial = new THREE.MeshBasicMaterial({
      color: 0x4488ff,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending
    });

    this.nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
    this.scene.add(this.nebula);
  }

  private addFloating404(): void {
    const loader = new FontLoader();
    loader.load('assets/fonts/helvetiker_regular.typeface.json', (font) => {
      const textGeometry = new TextGeometry('404', {
        font: font,
        size: 5,
        depth: 1,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.5,
        bevelSize: 0.3,
        bevelOffset: 0,
        bevelSegments: 5
      });

      const textMaterial = new THREE.MeshPhongMaterial({
        color: 0x44aaff,
        specular: 0x111111,
        shininess: 30,
        emissive: 0x0044ff,
        emissiveIntensity: 0.5
      });

      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(-10, 0, 0);
      textMesh.castShadow = true;
      this.scene.add(textMesh);

      this.addFloatingParticles(textMesh.position);
    });
  }

  private addFloatingParticles(position: THREE.Vector3): void {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x44aaff,
      size: 0.1,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particlesVertices = [];
    for (let i = 0; i < 500; i++) {
      const radius = 7 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      particlesVertices.push(x, y, z);
    }

    particlesGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(particlesVertices, 3)
    );

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    particles.position.copy(position);
    this.scene.add(particles);
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.composer.setSize(window.innerWidth, window.innerHeight);
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();

    if (this.nebula) {
      this.nebula.rotation.x += 0.0005;
      this.nebula.rotation.y += 0.001;
    }

    if (this.stars) {
      this.stars.rotation.x += 0.0001;
      this.stars.rotation.y += 0.0002;
    }

    this.mixers.forEach(mixer => mixer.update(delta));
    if (this.controls) this.controls.update();
    this.composer.render();
  }

  navigate(): void {
    this.router.navigate(['/']);
  }
}