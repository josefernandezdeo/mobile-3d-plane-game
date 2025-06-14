export class City {
    constructor() {
        this.group = new THREE.Group();
        this.buildings = [];
        this.createCity();
    }

    createCity() {
        this.createGround();
        this.createBuildings();
        this.createStreets();
        this.addCityLights();
        this.createClouds();
        this.createTrees();
    }

    createGround() {
        // Large ground plane for the city base
        const groundGeometry = new THREE.PlaneGeometry(200, 200);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x2d4a2b,  // Dark green ground
            transparent: true,
            opacity: 0.8
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        
        // Rotate to be horizontal
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -2;
        ground.receiveShadow = true;
        
        this.group.add(ground);
    }

    createBuildings() {
        const citySize = 80;
        const buildingSpacing = 8;
        const streetsEvery = 3; // Create a street every 3 buildings
        
        for (let x = -citySize / 2; x < citySize / 2; x += buildingSpacing) {
            for (let z = -citySize / 2; z < citySize / 2; z += buildingSpacing) {
                // Skip some positions for streets
                const gridX = Math.floor((x + citySize / 2) / buildingSpacing);
                const gridZ = Math.floor((z + citySize / 2) / buildingSpacing);
                
                // Create streets in a grid pattern
                if (gridX % streetsEvery === 0 || gridZ % streetsEvery === 0) {
                    continue; // Skip building, create street instead
                }
                
                // Random building parameters
                const height = Math.random() * 15 + 3; // Buildings 3-18 units tall
                const width = Math.random() * 3 + 2;   // Width 2-5 units
                const depth = Math.random() * 3 + 2;   // Depth 2-5 units
                
                this.createBuilding(x, z, width, height, depth);
            }
        }
    }

    createBuilding(x, z, width, height, depth) {
        // Enhanced building geometry with better materials
        const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
        
        // More realistic building colors and materials
        const buildingTypes = [
            { color: 0x8b7355, type: 'brick' },    // Brown brick
            { color: 0x708090, type: 'concrete' }, // Slate gray concrete
            { color: 0x696969, type: 'steel' },    // Dim gray steel
            { color: 0x2f4f4f, type: 'glass' },    // Dark slate glass
            { color: 0x778899, type: 'modern' },   // Light slate modern
            { color: 0x556b2f, type: 'office' }    // Dark olive office
        ];
        
        const buildingType = buildingTypes[Math.floor(Math.random() * buildingTypes.length)];
        
        let buildingMaterial;
        if (buildingType.type === 'glass') {
            buildingMaterial = new THREE.MeshPhongMaterial({ 
                color: buildingType.color,
                shininess: 100,
                specular: 0x444444,
                transparent: true,
                opacity: 0.9
            });
        } else {
            buildingMaterial = new THREE.MeshPhongMaterial({ 
                color: buildingType.color,
                shininess: 30,
                specular: 0x222222
            });
        }
        
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        
        // Position building
        building.position.set(x, height / 2 - 2, z);
        building.castShadow = true;
        building.receiveShadow = true;
        
        this.group.add(building);
        this.buildings.push(building);
        
        // Add detailed windows and features
        this.addBuildingDetails(building, x, z, width, height, depth, buildingType);
        
        // Add rooftop features
        this.addRooftopDetails(building, x, z, width, height, depth);
    }

    addBuildingDetails(building, x, z, width, height, depth, buildingType) {
        // Add detailed window grid system
        const floorHeight = 2.5;
        const floors = Math.floor(height / floorHeight);
        const windowSpacing = 1.2;
        
        // Calculate window grid for each face
        const windowsPerFaceX = Math.max(1, Math.floor(width / windowSpacing));
        const windowsPerFaceZ = Math.max(1, Math.floor(depth / windowSpacing));
        
        // Front and back faces
        for (let floor = 1; floor <= floors; floor++) {
            for (let i = 0; i < windowsPerFaceX; i++) {
                const windowX = (i - (windowsPerFaceX - 1) / 2) * windowSpacing;
                const windowY = (height / 2 - 2) + (floor * floorHeight) - height / 2;
                
                // Front face windows
                if (Math.random() > 0.3) { // 70% chance for lit windows
                    this.createWindow(x + windowX, windowY, z + depth / 2 + 0.02, 0, buildingType);
                }
                
                // Back face windows
                if (Math.random() > 0.3) {
                    this.createWindow(x + windowX, windowY, z - depth / 2 - 0.02, Math.PI, buildingType);
                }
            }
        }
        
        // Left and right faces
        for (let floor = 1; floor <= floors; floor++) {
            for (let i = 0; i < windowsPerFaceZ; i++) {
                const windowZ = (i - (windowsPerFaceZ - 1) / 2) * windowSpacing;
                const windowY = (height / 2 - 2) + (floor * floorHeight) - height / 2;
                
                // Left face windows
                if (Math.random() > 0.3) {
                    this.createWindow(x - width / 2 - 0.02, windowY, z + windowZ, Math.PI / 2, buildingType);
                }
                
                // Right face windows
                if (Math.random() > 0.3) {
                    this.createWindow(x + width / 2 + 0.02, windowY, z + windowZ, -Math.PI / 2, buildingType);
                }
            }
        }
    }
    
    createWindow(x, y, z, rotation, buildingType) {
        const windowGeometry = new THREE.PlaneGeometry(0.8, 1.5);
        
        let windowMaterial;
        if (buildingType.type === 'glass') {
            // Glass building - blue tinted windows
            windowMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x4488ff,
                transparent: true,
                opacity: 0.7
            });
        } else {
            // Regular building - warm light windows
            const lightColors = [0xffff88, 0xffffaa, 0xffeeaa, 0xffffff];
            const color = lightColors[Math.floor(Math.random() * lightColors.length)];
            windowMaterial = new THREE.MeshBasicMaterial({ 
                color: color,
                transparent: true,
                opacity: 0.9
            });
        }
        
        const window = new THREE.Mesh(windowGeometry, windowMaterial);
        window.position.set(x, y, z);
        window.rotation.y = rotation;
        
        this.group.add(window);
    }
    
    addRooftopDetails(building, x, z, width, height, depth) {
        const rooftopY = height / 2 - 2 + height / 2;
        
        // Add rooftop structures randomly
        if (Math.random() > 0.6) {
            // Air conditioning units
            const acGeometry = new THREE.BoxGeometry(0.8, 0.4, 0.6);
            const acMaterial = new THREE.MeshPhongMaterial({ color: 0x555555 });
            const ac = new THREE.Mesh(acGeometry, acMaterial);
            ac.position.set(
                x + (Math.random() - 0.5) * width * 0.6,
                rooftopY + 0.2,
                z + (Math.random() - 0.5) * depth * 0.6
            );
            ac.castShadow = true;
            this.group.add(ac);
        }
        
        if (Math.random() > 0.7) {
            // Antenna
            const antennaGeometry = new THREE.CylinderGeometry(0.02, 0.02, 2, 6);
            const antennaMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
            const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
            antenna.position.set(x, rooftopY + 1, z);
            antenna.castShadow = true;
            this.group.add(antenna);
        }
        
        if (Math.random() > 0.8) {
            // Rooftop light
            const lightGeometry = new THREE.SphereGeometry(0.15, 8, 8);
            const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const light = new THREE.Mesh(lightGeometry, lightMaterial);
            light.position.set(
                x + (Math.random() - 0.5) * width * 0.8,
                rooftopY + 0.15,
                z + (Math.random() - 0.5) * depth * 0.8
            );
            this.group.add(light);
        }
    }

    createStreets() {
        const citySize = 80;
        const buildingSpacing = 8;
        const streetsEvery = 3;
        const streetWidth = 6;
        
        // Horizontal streets
        for (let z = -citySize / 2; z < citySize / 2; z += buildingSpacing * streetsEvery) {
            const streetGeometry = new THREE.PlaneGeometry(citySize, streetWidth);
            const streetMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
            const street = new THREE.Mesh(streetGeometry, streetMaterial);
            
            street.rotation.x = -Math.PI / 2;
            street.position.set(0, -1.9, z);
            street.receiveShadow = true;
            
            this.group.add(street);
        }
        
        // Vertical streets
        for (let x = -citySize / 2; x < citySize / 2; x += buildingSpacing * streetsEvery) {
            const streetGeometry = new THREE.PlaneGeometry(streetWidth, citySize);
            const streetMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
            const street = new THREE.Mesh(streetGeometry, streetMaterial);
            
            street.rotation.x = -Math.PI / 2;
            street.position.set(x, -1.9, 0);
            street.receiveShadow = true;
            
            this.group.add(street);
        }
    }

    addCityLights() {
        const citySize = 60;
        const lightSpacing = 20;
        
        // Add street lights at intersections
        for (let x = -citySize / 2; x < citySize / 2; x += lightSpacing) {
            for (let z = -citySize / 2; z < citySize / 2; z += lightSpacing) {
                // Street light pole
                const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 6, 8);
                const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x222222 });
                const pole = new THREE.Mesh(poleGeometry, poleMaterial);
                
                pole.position.set(x, 1, z);
                pole.castShadow = true;
                this.group.add(pole);
                
                // Light source
                const lightGeometry = new THREE.SphereGeometry(0.3, 8, 8);
                const lightMaterial = new THREE.MeshBasicMaterial({ 
                    color: 0xffffcc,
                    transparent: true,
                    opacity: 0.8
                });
                const light = new THREE.Mesh(lightGeometry, lightMaterial);
                
                light.position.set(x, 4, z);
                this.group.add(light);
                
                // Actual Three.js light source
                const pointLight = new THREE.PointLight(0xffffcc, 0.5, 15);
                pointLight.position.set(x, 4, z);
                pointLight.castShadow = true;
                this.group.add(pointLight);
            }
        }
    }

    createClouds() {
        // Create fluffy clouds floating above the city
        const cloudCount = 12;
        
        for (let i = 0; i < cloudCount; i++) {
            const cloudGroup = new THREE.Group();
            
            // Create each cloud from multiple spheres for a fluffy appearance
            const sphereCount = 4 + Math.floor(Math.random() * 4); // 4-7 spheres per cloud
            
            for (let j = 0; j < sphereCount; j++) {
                const sphereSize = 3 + Math.random() * 4; // Random sizes 3-7 units
                const sphereGeometry = new THREE.SphereGeometry(sphereSize, 8, 6);
                const cloudMaterial = new THREE.MeshLambertMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: 0.8
                });
                
                const sphere = new THREE.Mesh(sphereGeometry, cloudMaterial);
                
                // Position spheres to form cloud shape
                sphere.position.set(
                    (Math.random() - 0.5) * 15, // Spread horizontally
                    (Math.random() - 0.5) * 4,  // Small vertical variation
                    (Math.random() - 0.5) * 12  // Spread in depth
                );
                
                cloudGroup.add(sphere);
            }
            
            // Position cloud group in the sky
            cloudGroup.position.set(
                (Math.random() - 0.5) * 120, // Spread across city
                40 + Math.random() * 20,     // Height 40-60 units
                (Math.random() - 0.5) * 120  // Spread across city
            );
            
            // Add gentle rotation for variety
            cloudGroup.rotation.y = Math.random() * Math.PI * 2;
            
            this.group.add(cloudGroup);
        }
    }
    
    createTrees() {
        // Add trees throughout the city for a more natural look
        const treeCount = 25;
        
        for (let i = 0; i < treeCount; i++) {
            const treeGroup = new THREE.Group();
            
            // Tree trunk
            const trunkHeight = 2 + Math.random() * 3; // 2-5 units tall
            const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, trunkHeight, 8);
            const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Brown
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
            trunk.position.y = trunkHeight / 2 - 2;
            trunk.castShadow = true;
            treeGroup.add(trunk);
            
            // Tree foliage - multiple green spheres for bushy appearance
            const foliageCount = 2 + Math.floor(Math.random() * 3); // 2-4 foliage clusters
            
            for (let j = 0; j < foliageCount; j++) {
                const foliageSize = 1.5 + Math.random() * 2; // 1.5-3.5 units
                const foliageGeometry = new THREE.SphereGeometry(foliageSize, 8, 6);
                const foliageMaterial = new THREE.MeshLambertMaterial({ 
                    color: j === 0 ? 0x228B22 : 0x32CD32 // Mix of dark and light green
                });
                const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
                
                foliage.position.set(
                    (Math.random() - 0.5) * 2,
                    trunkHeight - 1 + Math.random() * 2,
                    (Math.random() - 0.5) * 2
                );
                foliage.castShadow = true;
                foliage.receiveShadow = true;
                treeGroup.add(foliage);
            }
            
            // Position trees around the city (avoid building locations)
            let treeX, treeZ;
            let attempts = 0;
            do {
                treeX = (Math.random() - 0.5) * 80;
                treeZ = (Math.random() - 0.5) * 80;
                attempts++;
            } while (this.isNearBuilding(treeX, treeZ) && attempts < 10);
            
            treeGroup.position.set(treeX, 0, treeZ);
            this.group.add(treeGroup);
        }
    }
    
    isNearBuilding(x, z) {
        // Simple check to avoid placing trees too close to buildings
        const buildingSpacing = 8;
        const streetsEvery = 3;
        
        const gridX = Math.floor((x + 40) / buildingSpacing);
        const gridZ = Math.floor((z + 40) / buildingSpacing);
        
        // If it's not a street location, it might have a building
        if (gridX % streetsEvery !== 0 && gridZ % streetsEvery !== 0) {
            return true;
        }
        return false;
    }

    getGroup() {
        return this.group;
    }

    // Method to animate city lights (optional)
    update() {
        // Could add blinking lights or other animations here
    }
} 