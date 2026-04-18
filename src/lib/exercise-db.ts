
export interface Exercise {
  id: string;
  title: string;
  category: 'Musculação' | 'Calistenia' | 'Cardio';
  instructions: string;
  imageId: string;
}

export const EXERCISE_DATABASE: Exercise[] = [
  // Musculação
  { id: '1', title: 'Supino Reto', category: 'Musculação', instructions: 'Deite-se no banco, segure a barra com as mãos um pouco mais largas que os ombros. Desça até o peito e empurre.', imageId: 'supino-gif' },
  { id: '2', title: 'Agachamento Livre', category: 'Musculação', instructions: 'Pés na largura dos ombros, desça o quadril como se fosse sentar em uma cadeira, mantendo a coluna ereta.', imageId: 'agachamento-gif' },
  { id: '3', title: 'Levantamento Terra', category: 'Musculação', instructions: 'Pés na largura do quadril, coluna neutra, puxe a barra do chão estendendo quadril e joelhos.', imageId: 'terra-gif' },
  { id: '4', title: 'Desenvolvimento Militar', category: 'Musculação', instructions: 'Em pé, empurre a barra acima da cabeça até estender os braços completamente.', imageId: 'militar-gif' },
  { id: '5', title: 'Remada Curvada', category: 'Musculação', instructions: 'Incline o tronco, mantenha a coluna reta e puxe a barra em direção ao abdômen.', imageId: 'remada-gif' },
  { id: '6', title: 'Rosca Direta', category: 'Musculação', instructions: 'Em pé, flexione os cotovelos trazendo a barra em direção aos ombros.', imageId: 'rosca-gif' },
  
  // Calistenia
  { id: '21', title: 'Flexão de Braços', category: 'Calistenia', instructions: 'Corpo reto, desça o peito até o chão e empurre de volta.', imageId: 'flexao-gif' },
  { id: '22', title: 'Flexão de Braços com joelho', category: 'Calistenia', instructions: 'Corpo reto, com joelhos apoiados no chão, desça o peito até o chão e empurre de volta.', imageId: 'flexao-joelho-img' },
  { id: '23', title: 'Flexão Aberta', category: 'Calistenia', instructions: 'Corpo reto, braços abertos, desça o peito até o chão e empurre de volta.', imageId: 'flexao-aberta-gif' },
  { id: '25', title: 'Prancha', category: 'Calistenia', instructions: 'Apoie-se nos antebraços e pontas dos pés, mantendo o abdômen contraído.', imageId: 'prancha-img' },
  { id: '27', title: 'Abdominal Remador', category: 'Calistenia', instructions: 'Deitado em decúbito dorsal, braços estendidos atrás da cabeça. Flexione o tronco e os joelhos simultaneamente, abraçando as pernas.', imageId: 'remador-gif' },
  { id: '28', title: 'Força superior (negativas)', category: 'Calistenia', instructions: 'Para a barra na atura do queixo, após isso desça lentamente os braços, segurando por 5 segundos', imageId: 'forca-superior-gif' },
  { id: '29', title: 'Isometria na barra fixa', category: 'Calistenia', instructions: 'Segure por 15 segundos no topo da barra fixa', imageId: 'isometria-barra-gif' },
  { id: '30', title: 'Abdominais supras', category: 'Calistenia', instructions: 'Deitado de costas, com os joelhos flexionados e pés no chão, eleve apenas a parte superior do tronco (escápulas/ombros)', imageId: 'abdominal-supra-gif' },
  
  // Cardio
  { id: '41', title: 'Corrida Alternada', category: 'Cardio', instructions: 'Corrida alternada em trote leve em cadencia com tiros curtos de alta respiração', imageId: 'corrida-tfm-gif' },
  { id: '42', title: 'Ciclismo', category: 'Cardio', instructions: 'Pedalagem em intensidade moderada/alta. Excelente para fortalecimento de membros inferiores e fôlego.', imageId: 'ciclismo-gif' },
  { id: '43', title: 'Corrida', category: 'Cardio', instructions: 'Corrida com cadencia continua, focada em tempo e distancia', imageId: 'corrida-img' },
  { id: '44', title: 'Sprint em tiros', category: 'Cardio', instructions: 'Corra o mais rapido que conseguir durante um periodo de tempo ou distancia', imageId: 'sprint-tiros-gif' }
];
