import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as faceapi from 'face-api.js';
import './VirtualTryOn.css';

const VirtualTryOn = ({ model3DUrl }) => {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [useWebcam, setUseWebcam] = useState(false);
  const [image, setImage] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        ]);
        setModelsLoaded(true);
      } catch (err) {
        console.error('Erreur de chargement des modèles face-api:', err);
        setError('Erreur lors du chargement des modèles de détection faciale');
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (!modelsLoaded) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });

    const updateRendererSize = () => {
      const element = useWebcam ? videoRef.current : imgElement;
      if (!element) return;

      const width = element.videoWidth || element.width || containerRef.current.offsetWidth;
      const height = element.videoHeight || element.height || containerRef.current.offsetHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    let glasses;
    const loader = new GLTFLoader();
    if (model3DUrl) {
      loader.load(
        model3DUrl,
        (gltf) => {
          glasses = gltf.scene;
          glasses.scale.set(0.01, 0.01, 0.01);
          glasses.rotation.set(0, 0, 0);
          scene.add(glasses);
          console.log('Modèle 3D chargé:', glasses);
        },
        (progress) => {
          console.log('Chargement du modèle 3D:', (progress.loaded / progress.total) * 100, '%');
        },
        (error) => {
          console.error('Erreur de chargement du modèle 3D:', error);
          setError('Erreur lors du chargement du modèle 3D');
        }
      );
    } else {
      setError('Aucun modèle 3D fourni');
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = false;
    camera.position.z = 2;

    let video = null;
    let imgElement = null;
    if (useWebcam) {
      video = videoRef.current;
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          video.srcObject = stream;
          video.play();
          video.onloadedmetadata = () => {
            updateRendererSize();
          };
        })
        .catch((err) => {
          console.error('Erreur d\'accès à la webcam:', err);
          setError('Erreur d\'accès à la webcam');
        });
    } else if (image) {
      imgElement = new Image();
      imgElement.src = image;
      imgElement.onload = () => {
        updateRendererSize();
      };
    }

    const updateGlassesPosition = async () => {
      if (!glasses) return;

      let element = useWebcam ? videoRef.current : imgElement;
      if (!element || (useWebcam && !videoRef.current.videoWidth)) return;

      const canvasWidth = renderer.domElement.width;
      const canvasHeight = renderer.domElement.height;
      const detections = await faceapi
        .detectSingleFace(element, new faceapi.SsdMobilenetv1Options())
        .withFaceLandmarks();

      if (detections) {
        const landmarks = detections.landmarks;
        const leftEye = landmarks.getLeftEye()[0];
        const rightEye = landmarks.getRightEye()[4];
        const noseBridge = landmarks.getNose()[3];

        const faceWidth = Math.abs(leftEye.x - rightEye.x);
        const glassesScale = faceWidth / 1000; // Augmenté pour rendre plus petit
        glasses.scale.set(glassesScale, glassesScale, glassesScale);

        const eyeMidpointX = (leftEye.x + rightEye.x) / 2;
        const eyeMidpointY = (leftEye.y + rightEye.y) / 2;
        const x = ((eyeMidpointX - faceWidth * 0.03) / element.videoWidth) * 2 - 1; // Décalage vers la gauche
        const y = -((eyeMidpointY - faceWidth * 0.03) / element.videoHeight) * 2 + 1; // Décalage vers le haut
        const vector = new THREE.Vector3(x, y, -0.05).unproject(camera);
        glasses.position.copy(vector);

        const angle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
        glasses.rotation.y = angle;
        glasses.rotation.x = -Math.PI / 15;
        glasses.rotation.z = 0;

        console.log('Glasses Position:', glasses.position, 'Scale:', glassesScale);
      } else {
        console.log('No face detected');
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);
      updateGlassesPosition();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      updateRendererSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (video && video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }
      renderer.dispose();
    };
  }, [model3DUrl, useWebcam, image, modelsLoaded]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
      setUseWebcam(false);
    }
  };

  const toggleWebcam = () => {
    setUseWebcam(!useWebcam);
    if (image) setImage(null);
  };

  return (
    <div className="virtual-try-on" ref={containerRef}>
      <h2>Essayage Virtuel</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!modelsLoaded && <p>Chargement des modèles de détection...</p>}
      <div>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <button onClick={toggleWebcam}>{useWebcam ? 'Utiliser une image' : 'Utiliser la webcam'}</button>
      </div>
      <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: 'auto' }}>
        {useWebcam ? (
          <video ref={videoRef} style={{ width: '100%', height: 'auto' }} autoPlay />
        ) : image ? (
          <img src={image} alt="User face" style={{ width: '100%', height: 'auto' }} />
        ) : (
          <p>Veuillez uploader une image ou activer la webcam</p>
        )}
        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
      </div>
    </div>
  );
};

export default VirtualTryOn;