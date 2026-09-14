export const viewpoints = [
 { title: '거실 전경', english: 'LIVING ROOM', subtitle: '선과 면의 균형', description: '소파를 낮게 두고 배치에 여백을 남겼습니다. 생활 공간의 배경은 3000K 간접조명과 무광 백색 도장으로 정리했습니다.', material: '무광 도장 · 패브릭 · 대형 포세린', position: [6.3, 4.6, 7.5], target: [0, 0.7, -0.7] },
 { title: '다이닝', english: 'DINING AREA', subtitle: '함께하는 시간의 중심', description: '거실에서 다이닝으로 자연스럽게 이동하도록 배치했습니다. 맞춤 제작 식탁과 벽면 수납을 두고 동선에 여유를 남겼습니다.', material: '화이트 오크 · 솔리드 서피스 · 매립 수납', position: [5.5, 3.3, 3.7], target: [1.75, 0.95, -1.6] },
 { title: '마감 디테일', english: 'MATERIAL DETAIL', subtitle: '가까이에서 완성되는 공간', description: '석재의 두께와 가구의 모서리, 마감의 접합부를 가까이에서 살펴보세요. 도면의 선이 실제 공간에서 어떻게 이어지는지 확인합니다.', material: '천연석 상판 · 라운드 엣지 · 음각 걸레받이', position: [0.3, 1.9, 2.7], target: [-1.35, 0.5, -0.8] },
] satisfies { title: string; english: string; subtitle: string; description: string; material: string; position: [number, number, number]; target: [number, number, number] }[];
