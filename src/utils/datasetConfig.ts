export interface Dataset {
  name: string;
  path: string;
  type: 'drone' | 'satellite' | 'coco';
  format: string[];
}

export const datasets: Dataset[] = {
  drone: {
    name: 'Drone Imagery',
    path: '/path/to/your/drone/dataset',  // Replace with your actual drone dataset path
    type: 'drone',
    format: ['jpg', 'png']
  },
  satellite: {
    name: 'Satellite Imagery',
    path: '/path/to/your/satellite/dataset',  // Replace with your actual satellite dataset path
    type: 'satellite',
    format: ['jpg', 'png', 'tiff']
  },
  coco: {
    name: 'COCO Dataset',
    path: '/path/to/your/coco/dataset',  // Replace with your actual COCO dataset path
    type: 'coco',
    format: ['jpg']
  }
};