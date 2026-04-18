
export interface Exercise {
  id: string;
  title: string;
  category: 'Musculação' | 'Calistenia' | 'Cardio';
  instructions: string;
  imageId: string;
}

export const EXERCISE_DATABASE: Exercise[] = [
  // Musculação
  { id: '1', title: 'Supino Reto', category: 'Musculação', instructions: 'Deite-se no banco, segure a barra com as mãos um pouco mais largas que os ombros. Desça até o peito e empurre.', imageId: 'musculacao-peito' },
  { id: '2', title: 'Agachamento Livre', category: 'Musculação', instructions: 'Pés na largura dos ombros, desça o quadril como se fosse sentar em uma cadeira, mantendo a coluna ereta.', imageId: 'musculacao-pernas' },
  { id: '3', title: 'Levantamento Terra', category: 'Musculação', instructions: 'Pés na largura do quadril, coluna neutra, puxe a barra do chão estendendo quadril e joelhos.', imageId: 'musculacao-costas' },
  { id: '4', title: 'Desenvolvimento Militar', category: 'Musculação', instructions: 'Em pé, empurre a barra acima da cabeça até estender os braços completamente.', imageId: 'musculacao-ombros' },
  { id: '5', title: 'Remada Curvada', category: 'Musculação', instructions: 'Incline o tronco, mantenha a coluna reta e puxe a barra em direção ao abdômen.', imageId: 'musculacao-costas' },
  { id: '6', title: 'Rosca Direta', category: 'Musculação', instructions: 'Em pé, flexione os cotovelos trazendo a barra em direção aos ombros.', imageId: 'musculacao-bracos' },
  { id: '7', title: 'Tríceps Corda', category: 'Musculação', instructions: 'Na polia alta, estenda os braços para baixo separando as pontas da corda.', imageId: 'musculacao-bracos' },
  { id: '21', title: 'Flexão de Braços', category: 'Calistenia', instructions: 'Corpo reto, desça o peito até o chão e empurre de volta.', imageId: 'flexao-anatomia' },
  { id: '25', title: 'Prancha Abdominal', category: 'Calistenia', instructions: 'Apoie-se nos antebraços e pontas dos pés, mantendo o abdômen contraído.', imageId: 'abs-workout' },
  // ... outros exercícios podem ser adicionados aqui conforme necessário
];
