import { Component, OnInit, ElementRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import type { TextGeometryParameters } from 'three/examples/jsm/geometries/TextGeometry';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, RippleModule, ButtonModule, MenubarModule],
  template: `
    <div class="layout-container">
     
    
      
      <!-- Main Content with 3D Animation -->
      <main class="main-content">
        <div class="animation-container" #animationContainer></div>
        
        <div class="dashboard-container">
          <div class="dashboard-card">
            <h1 class="title">Master Management</h1>
            <p class="subtitle">Dashboard works! Manage everything dynamically.</p>
            
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">583</div>
                <div class="stat-label">Active Users</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">127</div>
                <div class="stat-label">New Orders</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">94%</div>
                <div class="stat-label">Performance</div>
              </div>
              <div class="stat-card">
          <div class="stat-value">₹12.4k</div>
                <div class="stat-label">Revenue</div>
              </div>
            </div>
            
            <div class="action-buttons">
              <p-button 
                label="Analytics" 
                icon="pi pi-chart-line" 
                styleClass="p-button-raised p-button-primary"
              ></p-button>
              <p-button 
                label="Reports" 
                icon="pi pi-file" 
                styleClass="p-button-raised p-button-secondary"
              ></p-button>
              <p-button 
                label="Settings" 
                icon="pi pi-cog" 
                styleClass="p-button-raised"
              ></p-button>
            </div>
          </div>
        </div>
      </main>

    </div>
  `,
  styles: [`
   @keyframes gradientFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.layout-container {
  align-items: center;
  justify-content: center;
  width: 80%;
  height: 600px;
  background-color: transparent;
  color: white;
  padding: 1rem;
  border-radius: 10px;
  margin: 5rem auto;
}

.header {
  background-color: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(10px);
  color: white;
  padding: 0.5rem 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(59, 130, 246, 0.3);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: transparent;
  padding: 1rem;
  position: relative;
  overflow: hidden;
}

.animation-container {
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
}

.dashboard-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  margin-top: 2rem;
  z-index: 1;
}

.dashboard-card {
  background: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 1200px;
  border: 1px solid rgba(59, 130, 246, 0.3);
  animation: float 6s ease-in-out infinite;
}

.title {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% auto;
  animation: gradientFlow 6s linear infinite;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.subtitle {
  font-size: 1.2rem;
  color: #e2e8f0;
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(8px);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(59, 130, 246, 0.2);
  animation: pulse 3s ease-in-out infinite;
  animation-delay: calc(var(--n) * 0.5s);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.2);
  background: rgba(59, 130, 246, 0.3);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.stat-label {
  font-size: 1rem;
  color: #e2e8f0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 2rem;
}

.action-buttons p-button {
  margin-bottom: 1rem;
}

.p-button {
  background-color: rgba(59, 130, 246, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.p-button:hover {
  background-color: rgba(59, 130, 246, 0.9);
}

.footer {
  background-color: rgba(30, 41, 59, 0.9);
  color: white;
  text-align: center;
  padding: 1rem;
  font-size: 0.9rem;
  box-shadow: 0 -4px 15px rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(59, 130, 246, 0.3);
}

@media (max-width: 768px) {
  .stat-card {
    padding: 1rem;
  }
  
  .stat-value {
    font-size: 1.8rem;
  }
  
  .dashboard-card {
    padding: 1.5rem;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .layout-container {
    width: 95%;
    margin: 2rem auto;
  }
}
  `]
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('animationContainer', { static: true }) animationContainer!: ElementRef;
  
  menuItems = [
    {
      label: 'Home',
      icon: 'pi pi-home'
    },
    {
      label: 'Dashboard',
      icon: 'pi pi-chart-bar'
    },
    {
      label: 'Management',
      icon: 'pi pi-cog',
      items: [
        { label: 'Users', icon: 'pi pi-users' },
        { label: 'Products', icon: 'pi pi-box' },
        { label: 'Orders', icon: 'pi pi-shopping-cart' }
      ]
    },
    {
      label: 'Reports',
      icon: 'pi pi-file'
    },
    {
      label: 'Analytics',
      icon: 'pi pi-chart-line'
    }
  ];

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private composer!: EffectComposer;
  private clock = new THREE.Clock();
  private mainText!: THREE.Mesh;
  private particles: THREE.Points[] = [];
  private rings: THREE.Mesh[] = [];
  private cubes: THREE.Mesh[] = [];
  private stars: THREE.Points[] = [];
  private particleGroups: THREE.Group[] = [];
  private animationFrameId!: number;
  private loaded = false;
  
  ngOnInit(): void {
    this.initThreeJS();
  }
  
  ngAfterViewInit(): void {
    // Add animated stats counter for stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
      card.setAttribute('style', `--n: ${index}`);
    });
  }
  
  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
  
  private initThreeJS(): void {
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0f172a, 0.008);
    
    // Create camera
    const containerWidth = this.animationContainer.nativeElement.clientWidth;
    const containerHeight = this.animationContainer.nativeElement.clientHeight;
    this.camera = new THREE.PerspectiveCamera(
      75, 
      containerWidth / containerHeight, 
      0.1, 
      1000
    );
    this.camera.position.z = 30;
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(containerWidth, containerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x0f172a, 1);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.animationContainer.nativeElement.appendChild(this.renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x2a4365, 0.5);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0x3b82f6, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);
    
    const pointLight1 = new THREE.PointLight(0x3b82f6, 2, 50);
    pointLight1.position.set(0, 5, 10);
    pointLight1.castShadow = true;
    this.scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x8b5cf6, 2, 50);
    pointLight2.position.set(10, 0, 5);
    this.scene.add(pointLight2);
    
    const pointLight3 = new THREE.PointLight(0xec4899, 2, 50);
    pointLight3.position.set(-10, -5, 8);
    this.scene.add(pointLight3);
    
    // Setup post-processing
    this.setupPostProcessing();
    
    // Setup controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = false;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.5;
    
    // Create 3D environment
    this.createStarField();
    this.createParticles();
    this.createGlowingRings();
    this.createFloatingCubes();
    
    // Load font and create text
    const fontLoader = new FontLoader();
    fontLoader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
      this.createMainText(font);
      this.createFloatingText(font, 'Dynamic', new THREE.Vector3(-15, 8, 0));
      this.createFloatingText(font, 'Powerful', new THREE.Vector3(15, 8, 0));
      this.createFloatingText(font, 'Advanced', new THREE.Vector3(0, -8, 0));
      
      this.loaded = true;
      
      // Start animation loop
      this.animate();
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
      const containerWidth = this.animationContainer.nativeElement.clientWidth;
      const containerHeight = this.animationContainer.nativeElement.clientHeight;
      
      this.camera.aspect = containerWidth / containerHeight;
      this.camera.updateProjectionMatrix();
      
      this.renderer.setSize(containerWidth, containerHeight);
      this.composer.setSize(containerWidth, containerHeight);
    });
  }
  
  private setupPostProcessing(): void {
    // Create composer
    this.composer = new EffectComposer(this.renderer);
    
    // Add render pass
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
    
    // Add bloom pass for glow effects
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.8,   // strength
      0.4,   // radius
      0.85   // threshold
    );
    this.composer.addPass(bloomPass);
    
    // Add subtle glitch effect (disabled by default but can be toggled)
    const glitchPass = new GlitchPass();
    glitchPass.enabled = false;
    this.composer.addPass(glitchPass);
    
    // Add custom effect for color correction if needed
    const shaderPass = new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        time: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float time;
        varying vec2 vUv;
        
        void main() {
          vec4 color = texture2D(tDiffuse, vUv);
          
          // Subtle color shifting
          float r = color.r + 0.03 * sin(time * 0.5);
          float g = color.g + 0.03 * sin(time * 0.5 + 2.0);
          float b = color.b + 0.03 * sin(time * 0.5 + 4.0);
          
          gl_FragColor = vec4(r, g, b, color.a);
        }
      `
    });
    this.composer.addPass(shaderPass);
    
    // Store shader pass for animation updates
    (this as any).shaderPass = shaderPass;
  }
  
  private createMainText(font: any): void {
    // Create text geometry parameters with proper type
    const textGeometryParams: TextGeometryParameters = {
      font: font,
      size: 3.5,
      depth: 0.8,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.2,
      bevelSize: 0.1,
      bevelOffset: 0,
      bevelSegments: 8
    };
    
    // Create text geometry
    const textGeometry = new TextGeometry('MASTER', textGeometryParams);
    
    // Center the text 
    textGeometry.computeBoundingBox();
    if (textGeometry.boundingBox) {
      const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
      const textHeight = textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y;
      textGeometry.translate(-textWidth / 2, -textHeight / 2, 0);
    }
    
    // Create material with gradient
    const textMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x3b82f6,
      metalness: 0.9,
      roughness: 0.2,
      reflectivity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0.2,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.2
    });
    
    // Create mesh with geometry and material
    this.mainText = new THREE.Mesh(textGeometry, textMaterial);
    this.mainText.castShadow = true;
    this.mainText.receiveShadow = true;
    this.scene.add(this.mainText);
    
    // Create second line of text
    const mgmtGeometry = new TextGeometry('MANAGEMENT', {
      ...textGeometryParams,
      size: 2.5
    });
    
    // Center the text
    mgmtGeometry.computeBoundingBox();
    if (mgmtGeometry.boundingBox) {
      const textWidth = mgmtGeometry.boundingBox.max.x - mgmtGeometry.boundingBox.min.x;
      const textHeight = mgmtGeometry.boundingBox.max.y - mgmtGeometry.boundingBox.min.y;
      mgmtGeometry.translate(-textWidth / 2, -textHeight / 2, 0);
    }
    
    const mgmtMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x8b5cf6,
      metalness: 0.9,
      roughness: 0.2,
      reflectivity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0.2,
      emissive: 0x8b5cf6,
      emissiveIntensity: 0.2
    });
    
    const mgmtText = new THREE.Mesh(mgmtGeometry, mgmtMaterial);
    mgmtText.position.y = -5;
    mgmtText.castShadow = true;
    mgmtText.receiveShadow = true;
    this.scene.add(mgmtText);
  }
  
  private createFloatingText(font: any, text: string, position: THREE.Vector3): void {
    const textGeometryParams: TextGeometryParameters = {
      font: font,
      size: 1.2,
      depth: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.03,
      bevelOffset: 0,
      bevelSegments: 5
    };
    
    // Create text geometry
    const textGeometry = new TextGeometry(text, textGeometryParams);
    
    // Center the text
    textGeometry.computeBoundingBox();
    if (textGeometry.boundingBox) {
      const textWidth = textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x;
      const textHeight = textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y;
      textGeometry.translate(-textWidth / 2, -textHeight / 2, 0);
    }
    
    // Create material with emissive properties
    const textMaterial = new THREE.MeshPhongMaterial({
      color: 0xec4899,
      specular: 0xffffff,
      shininess: 100,
      emissive: 0xec4899,
      emissiveIntensity: 0.5
    });
    
    // Create mesh
    const floatingText = new THREE.Mesh(textGeometry, textMaterial);
    floatingText.position.copy(position);
    floatingText.userData = {
      initialPosition: position.clone(),
      floatSpeed: 0.0007 + Math.random() * 0.0005,
      rotationSpeed: 0.002 + Math.random() * 0.002
    };
    
    this.scene.add(floatingText);
    this.cubes.push(floatingText);  // Add to cubes array for animation
  }
  
  private createStarField(): void {
    // Create multiple star fields with different sizes and speeds
    for (let i = 0; i < 3; i++) {
      const starGeometry = new THREE.BufferGeometry();
      const starCount = i === 0 ? 2000 : (i === 1 ? 1000 : 500);
      const starSize = i === 0 ? 0.1 : (i === 1 ? 0.2 : 0.3);
      const starSpeed = i === 0 ? 0.0001 : (i === 1 ? 0.0002 : 0.0003);
      
      const positions = new Float32Array(starCount * 3);
      const colors = new Float32Array(starCount * 3);
      const sizes = new Float32Array(starCount);
      
      for (let j = 0; j < starCount; j++) {
        // Position stars in sphere around center
        const radius = 50 + Math.random() * 150;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[j * 3 + 2] = radius * Math.cos(phi);
        
        // Random star colors with blue/purple bias
        colors[j * 3] = 0.5 + Math.random() * 0.5;  // Red
        colors[j * 3 + 1] = 0.5 + Math.random() * 0.5;  // Green
        colors[j * 3 + 2] = 0.7 + Math.random() * 0.3;  // Blue (higher bias)
        
        // Vary star sizes
        sizes[j] = starSize * (0.5 + Math.random());
      }
      
      starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      
      const starMaterial = new THREE.PointsMaterial({
        size: starSize,
        vertexColors: true,
        transparent: true,
        opacity: 0.7,
        sizeAttenuation: true
      });
      
      const starField = new THREE.Points(starGeometry, starMaterial);
      starField.userData = { speed: starSpeed };
      this.scene.add(starField);
      this.stars.push(starField);
    }
  }
  
  private createParticles(): void {
    // Create multiple particle systems
    for (let i = 0; i < 5; i++) {
      const particleGroup = new THREE.Group();
      this.scene.add(particleGroup);
      this.particleGroups.push(particleGroup);
      
      // Create different particle clusters
      for (let j = 0; j < 3; j++) {
        const particleCount = 200 + Math.floor(Math.random() * 300);
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        const radius = 3 + Math.random() * 5;
        const center = new THREE.Vector3(
          (Math.random() - 0.5) * 30, 
          (Math.random() - 0.5) * 20, 
          (Math.random() - 0.5) * 10
        );
        
        for (let k = 0; k < particleCount; k++) {
          // Create cluster of particles
          const offset = new THREE.Vector3(
            (Math.random() - 0.5) * radius,
            (Math.random() - 0.5) * radius,
            (Math.random() - 0.5) * radius
          );
          
          positions[k * 3] = center.x + offset.x;
          positions[k * 3 + 1] = center.y + offset.y;
          positions[k * 3 + 2] = center.z + offset.z;
          
          // Assign colors based on position
          colors[k * 3] = 0.5 + Math.sin(center.x * 0.1) * 0.5;  // Red
          colors[k * 3 + 1] = 0.5 + Math.sin(center.y * 0.1) * 0.5;  // Green
          colors[k * 3 + 2] = 0.7 + Math.sin(center.z * 0.1) * 0.3;  // Blue
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
          size: 0.1 + Math.random() * 0.1,
          vertexColors: true,
          transparent: true,
          opacity: 0.7,
          depthWrite: false
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        particles.userData = {
          initialPosition: center.clone(),
          amplitude: 5 + Math.random() * 5,
          frequency: 0.0002 + Math.random() * 0.0005,
          phase: Math.random() * Math.PI * 2
        };
        
        particleGroup.add(particles);
        this.particles.push(particles);
      }
      
      // Set group properties for overall movement
      particleGroup.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.001,
          y: (Math.random() - 0.5) * 0.001,
          z: (Math.random() - 0.5) * 0.001
        }
      };
    }
  }
  
  private createGlowingRings(): void {
    // Create multiple rings with different sizes and colors
    for (let i = 0; i < 10; i++) {
      const ringGeometry = new THREE.TorusGeometry(
        5 + Math.random() * 10, // radius
        0.1 + Math.random() * 0.2, // tube
        16, // radialSegments
        100 // tubularSegments
      );
      
      // Choose a color from a palette
      const colors = [0x3b82f6, 0x8b5cf6, 0xec4899, 0x06b6d4, 0x10b981];
      const colorIndex = Math.floor(Math.random() * colors.length);
      
      const ringMaterial = new THREE.MeshPhongMaterial({
        color: colors[colorIndex],
        emissive: colors[colorIndex],
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
      });
      
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      
      // Position ring randomly in space
      ring.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20
      );
      
      // Random rotation
      ring.rotation.x = Math.random() * Math.PI * 2;
      ring.rotation.y = Math.random() * Math.PI * 2;
      ring.rotation.z = Math.random() * Math.PI * 2;
      
      // Store animation properties
      ring.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.005,
          y: (Math.random() - 0.5) * 0.005,
          z: (Math.random() - 0.5) * 0.005
        },
        pulseSpeed: 0.001 + Math.random() * 0.002,
        initialScale: 0.8 + Math.random() * 0.4
      };
      
      ring.scale.setScalar(ring.userData['initialScale']);
      this.scene.add(ring);
      this.rings.push(ring);
    }
  }

  private createFloatingCubes(): void {
    // Create floating cubes with different colors and sizes
    for (let i = 0; i < 15; i++) {
      const size = 0.5 + Math.random() * 1.5;
      const cubeGeometry = new THREE.BoxGeometry(size, size, size);
      
      // Choose a color from a palette
      const colors = [0x3b82f6, 0x8b5cf6, 0xec4899, 0x06b6d4, 0x10b981];
      const colorIndex = Math.floor(Math.random() * colors.length);
      
      const cubeMaterial = new THREE.MeshPhongMaterial({
        color: colors[colorIndex],
        emissive: colors[colorIndex],
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.8,
        shininess: 100
      });
      
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      
      // Position cube randomly in space
      cube.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30
      );
      
      // Random rotation
      cube.rotation.x = Math.random() * Math.PI * 2;
      cube.rotation.y = Math.random() * Math.PI * 2;
      cube.rotation.z = Math.random() * Math.PI * 2;
      
      // Store animation properties
      cube.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01,
          z: (Math.random() - 0.5) * 0.01
        },
        floatSpeed: 0.0005 + Math.random() * 0.001,
        floatAmplitude: 2 + Math.random() * 3,
        initialPosition: cube.position.clone()
      };
      
      this.scene.add(cube);
      this.cubes.push(cube);
    }
  }

  private animate(): void {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    
    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();
    
    // Update controls
    if (this.controls) {
      this.controls.update();
    }
    
    // Animate main text
    if (this.mainText) {
      this.mainText.rotation.y = elapsedTime * 0.1;
      this.mainText.position.y = Math.sin(elapsedTime * 0.5) * 0.5;
    }
    
    // Animate stars
    this.stars.forEach(starField => {
      starField.rotation.x += starField.userData['speed'] * 0.5;
      starField.rotation.y += starField.userData['speed'];
    });
    
    // Animate particles
    this.particles.forEach(particles => {
      const { initialPosition, amplitude, frequency, phase } = particles.userData;
      const time = elapsedTime * frequency + phase;
      
      particles.position.x = initialPosition.x + Math.sin(time) * amplitude;
      particles.position.y = initialPosition.y + Math.cos(time * 0.7) * amplitude;
      particles.position.z = initialPosition.z + Math.sin(time * 0.3) * amplitude;
    });
    
    // Animate particle groups
    this.particleGroups.forEach(group => {
      const { rotationSpeed } = group.userData;
      group.rotation.x += rotationSpeed.x;
      group.rotation.y += rotationSpeed.y;
      group.rotation.z += rotationSpeed.z;
    });
    
    // Animate rings
    this.rings.forEach(ring => {
      const { rotationSpeed, pulseSpeed, initialScale } = ring.userData;
      
      ring.rotation.x += rotationSpeed.x;
      ring.rotation.y += rotationSpeed.y;
      ring.rotation.z += rotationSpeed.z;
      
      // Pulsing effect
      const scale = initialScale + Math.sin(elapsedTime * pulseSpeed) * 0.1;
      ring.scale.setScalar(scale);
    });
    
    // Animate cubes
    this.cubes.forEach(cube => {
      const { rotationSpeed, floatSpeed, floatAmplitude, initialPosition } = cube.userData;
      
      cube.rotation.x += rotationSpeed.x;
      cube.rotation.y += rotationSpeed.y;
      cube.rotation.z += rotationSpeed.z;
      
      // Floating effect
      cube.position.y = initialPosition.y + Math.sin(elapsedTime * floatSpeed) * floatAmplitude;
    });
    
    // Update shader pass time uniform if it exists
    if ((this as any).shaderPass) {
      (this as any).shaderPass.uniforms.time.value = elapsedTime;
    }
    
    // Render scene with effects
    this.composer.render();
  }
}