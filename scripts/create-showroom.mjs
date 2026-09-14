import { Document, NodeIO } from '@gltf-transform/core';
import { KHRDracoMeshCompression } from '@gltf-transform/extensions';
import { draco } from '@gltf-transform/functions';
import draco3d from 'draco3dgltf';
import { BoxGeometry, CylinderGeometry, SphereGeometry } from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mkdir } from 'node:fs/promises';

const document = new Document();
const buffer = document.createBuffer();
const scene = document.createScene('AERO Gallery Residence');
const materials = {};
for (const [name, color, roughness] of [
 ['Plaster', [0.94,0.945,0.925,1], 0.92], ['Limestone', [0.73,0.75,0.71,1], .8],
 ['Fabric', [.82,.825,.8,1], 1], ['Black', [.055,.065,.05,1], .55],
 ['Oak', [.58,.57,.51,1], .83], ['White', [.97,.97,.95,1], .75], ['Window', [.97,.98,.96,1], .3],
 ['Joint', [.58,.61,.56,1], .85], ['Art', [.22,.24,.2,1], .9],
]) materials[name] = document.createMaterial(name).setBaseColorFactor(color).setRoughnessFactor(roughness).setMetallicFactor(0);
materials.Window.setEmissiveFactor([.35,.38,.35]);
function shape(name, geometry, position, material = 'Plaster', rotation) {
 const primitive = document.createPrimitive();
 for (const [semantic, attributeName] of [['POSITION','position'], ['NORMAL','normal']]) {
  const attribute = geometry.getAttribute(attributeName);
  primitive.setAttribute(semantic, document.createAccessor().setType('VEC3').setArray(new Float32Array(attribute.array)).setBuffer(buffer));
 }
 if (geometry.index) primitive.setIndices(document.createAccessor().setType('SCALAR').setArray(new Uint32Array(geometry.index.array)).setBuffer(buffer));
 primitive.setMaterial(materials[material]);
 const mesh = document.createMesh(name).addPrimitive(primitive);
 const node = document.createNode(name).setMesh(mesh).setTranslation(position);
 if (rotation) node.setRotation(rotation);
 scene.addChild(node); geometry.dispose();
 return node;
}
function box(name, size, pos, material = 'Plaster', radius = 0) { return shape(name, radius ? new RoundedBoxGeometry(...size, 3, radius) : new BoxGeometry(...size), pos, material); }
function cylinder(name, radius, height, pos, material = 'Black') { return shape(name, new CylinderGeometry(radius, radius, height, 24), pos, material); }
box('Continuous floor', [8,.18,7], [0,-.12,-.3], 'Limestone');
box('Back wall', [8,3.25,.15], [0,1.55,-3.75]);
box('Window wall lower', [.14,.4,7], [-4,.12,-.3]);
box('Window wall upper', [.14,.25,7], [-4,3,-.3]);
for (let i=0;i<4;i++) {
 box('Window light '+i, [.025,2.55,1.55], [-4,1.55,-2.95+i*1.68], 'Window');
 box('Window mullion '+i, [.19,2.85,.065], [-3.95,1.55,-3.74+i*1.68], 'White');
}
for (let x=-3;x<=3;x+=1.5) box('Floor grout vertical', [.009,.002,7], [x,-.025,-.3], 'Joint');
for (let z=-3;z<=3;z+=1.5) box('Floor grout horizontal', [8,.002,.009], [0,-.025,z], 'Joint');
box('Lounge rug', [3.5,.028,3.3], [-1.65,.002,-.65], 'White', .01);
box('Sofa plinth', [2.8,.25,.95], [-1.7,.23,-2.25], 'Oak', .06);
box('Sofa seat', [2.8,.3,1], [-1.7,.48,-2.25], 'Fabric', .12);
box('Sofa back', [2.85,.7,.22], [-1.7,.87,-2.72], 'Fabric', .1);
box('Sofa left arm', [.22,.55,1.05], [-3.08,.7,-2.25], 'Fabric', .09);
box('Sofa right arm', [.22,.55,1.05], [-.32,.7,-2.25], 'Fabric', .09);
for(let i=0;i<3;i++) box('Back cushion '+i,[.79,.47,.19],[-2.6+i*.88,.87,-2.54],'White',.065);
box('Stone table top', [1.7,.12,.82], [-1.7,.45,-.58], 'White', .055);
box('Stone table base', [1,.36,.56], [-1.7,.2,-.58], 'Limestone', .03);
box('Art book',[.3,.035,.23],[-1.9,.532,-.55],'Black');
cylinder('Ceramic vessel',.1,.19,[-1.35,.595,-.57],'Plaster');
box('Lounge chair seat',[.82,.17,.85],[-2.8,.42,1.1],'Black',.08);
box('Lounge chair back',[.82,.62,.14],[-2.8,.76,1.44],'Black',.06);
for(const x of [-3.13,-2.47])for(const z of [.8,1.4]) cylinder('Lounge chair leg',.026,.4,[x,.18,z]);
box('Art frame',[1.65,1.2,.05],[-1.65,1.95,-3.64],'Black');
box('Artwork',[1.58,1.13,.012],[-1.65,1.95,-3.6],'White');
box('Artwork composition A',[.12,.8,.013],[-1.9,1.95,-3.587],'Art');
box('Artwork composition B',[.62,.12,.014],[-1.6,1.95,-3.585],'Art');
box('Dining surface',[1.65,.08,1.1],[1.8,.78,-1.35],'Oak',.035);
for(const x of [1.12,2.48])for(const z of [-1.8,-.9]) cylinder('Dining table leg',.045,.73,[x,.365,z],'Oak');
for(const [x,z,backZ] of [[1.28,-2.2,-2.45],[2.32,-2.2,-2.45],[1.28,-.5,-.25],[2.32,-.5,-.25]]) {
 box('Dining chair seat',[.5,.085,.49],[x,.45,z],'White',.025);
 box('Dining chair back',[.5,.44,.065],[x,.69,backZ],'Oak',.025);
 for(const dx of [-.19,.19])for(const dz of [-.17,.17]) cylinder('Dining chair leg',.019,.43,[x+dx,.215,z+dz],'Black');
}
cylinder('Dining pendant',.33,.14,[1.8,2.38,-1.35],'Black');
cylinder('Pendant cable',.006,.7,[1.8,2.8,-1.35],'Black');
box('Built in cabinetry',[2.85,2.8,.36],[2.1,1.37,-3.48],'Plaster');
for(let i=0;i<4;i++) box('Flush cabinet line',[.007,2.7,.004],[.71+i*.7,1.37,-3.296],'Joint');
box('Display ledge',[1.7,.09,.26],[2.1,1.03,-3.17],'Oak');
cylinder('Sculptural vase',.1,.35,[2.1,1.25,-3.17],'Black');
shape('Sculpture', new SphereGeometry(.16,20,16),[2.6,1.23,-3.17],'Limestone');
const io = new NodeIO().registerExtensions([KHRDracoMeshCompression]).registerDependencies({
 'draco3d.encoder': await draco3d.createEncoderModule(),
 'draco3d.decoder': await draco3d.createDecoderModule(),
});
await document.transform(draco({ method: 'edgebreaker', encodeSpeed: 5, decodeSpeed: 5 }));
await mkdir('public/models', {recursive:true});
await io.write('public/models/showroom.glb', document);
console.log('Created Draco-compressed gallery residence: public/models/showroom.glb');
