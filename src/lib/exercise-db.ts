
export interface Exercise {
  id: string;
  title: string;
  category: 'Musculação' | 'Calistenia' | 'Cardio';
  instructions: string;
  imageId: string;
}

export const EXERCISE_DATABASE: Exercise[] = [
  // Musculação
  { id: '1', title: 'Supino Reto', category: 'Musculação', instructions: 'Deite-se no banco e segure a barra com as mãos um pouco mais largas que os ombros. Desça até o peito e empurre de volta.', imageId: 'supino-gif' },
  { id: '2', title: 'Agachamento Livre', category: 'Musculação', instructions: 'Pés na largura dos ombros, desça o quadril como se fosse sentar em uma cadeira, mantendo a coluna ereta.', imageId: 'agachamento-gif' },
  { id: '3', title: 'Levantamento Terra', category: 'Musculação', instructions: 'Pés na largura do quadril e coluna neutra. Puxe a barra do chão estendendo o quadril e os joelhos simultaneamente.', imageId: 'terra-gif' },
  { id: '4', title: 'Desenvolvimento Militar', category: 'Musculação', instructions: 'Em pé, empurre a barra acima da cabeça até estender os braços completamente, mantendo o abdômen contraído.', imageId: 'militar-gif' },
  { id: '5', title: 'Remada Curvada', category: 'Musculação', instructions: 'Incline o tronco à frente, mantenha a coluna reta e puxe a barra em direção ao abdômen.', imageId: 'remada-gif' },
  { id: '6', title: 'Rosca Direta', category: 'Musculação', instructions: 'Em pé, flexione os cotovelos trazendo a barra em direção aos ombros sem balançar o corpo.', imageId: 'rosca-gif' },
  
  // Calistenia
  { id: '21', title: 'Flexão de Braços', category: 'Calistenia', instructions: 'Mantenha o corpo reto, desça o peito até o chão e empurre de volta à posição inicial.', imageId: 'flexao-gif' },
  { id: '22', title: 'Flexão de Braços com Joelhos', category: 'Calistenia', instructions: 'Mantenha o corpo reto com os joelhos apoiados no chão. Desça o peito até o chão e empurre de volta.', imageId: 'flexao-joelho-img' },
  { id: '23', title: 'Flexão Aberta', category: 'Calistenia', instructions: 'Mantenha as mãos em uma posição mais larga que o normal. Desça o peito até o chão e empurre de volta.', imageId: 'flexao-aberta-gif' },
  { id: '24', title: 'Flexão no Banco', category: 'Calistenia', instructions: 'Com as mãos apoiadas em um banco ou superfície elevada, desça o peito e empurre de volta.', imageId: 'flexao-banco-gif' },
  { id: '25', title: 'Prancha Isométrica', category: 'Calistenia', instructions: 'Apoie-se nos antebraços e pontas dos pés, mantendo o corpo alinhado e o abdômen contraído.', imageId: 'prancha-img' },
  { id: '27', title: 'Abdominal Remador', category: 'Calistenia', instructions: 'Deitado de costas com braços estendidos. Flexione o tronco e os joelhos simultaneamente, abraçando as pernas.', imageId: 'remador-gif' },
  { id: '28', title: 'Força Superior (Negativas)', category: 'Calistenia', instructions: 'Suba na barra até o queixo e desça o corpo de forma lenta e controlada, levando cerca de 5 segundos.', imageId: 'forca-superior-gif' },
  { id: '29', title: 'Isometria na Barra Fixa', category: 'Calistenia', instructions: 'Mantenha o corpo sustentado no topo da barra fixa, com o queixo acima da barra, pelo tempo determinado.', imageId: 'isometria-barra-gif' },
  { id: '30', title: 'Abdominal Supra', category: 'Calistenia', instructions: 'Deitado de costas e com os joelhos flexionados, eleve apenas a parte superior do tronco contraindo o abdômen.', imageId: 'abdominal-supra-gif' },
  { id: '31', title: 'Suspensão na Barra Fixa', category: 'Calistenia', instructions: 'Mantenha o corpo suspenso e esticado pelo maior tempo possível na barra fixa.', imageId: 'pendurar-barra-gif' },
  { id: '32', title: 'Elevação de Pernas', category: 'Calistenia', instructions: 'Deitado no chão com o corpo reto, eleve as pernas até 90 graus e retorne lentamente à posição inicial.', imageId: 'elevacao-perna-img' },
  { id: '50', title: 'Simulado TAF', category: 'Calistenia', instructions: 'Realize o máximo de repetições dos exercícios do TAF: corrida, flexão, abdominal e barra fixa.', imageId: 'simulado-taf-img' },
  
  // Cardio
  { id: '41', title: 'Corrida Alternada', category: 'Cardio', instructions: 'Corrida intervalada composta por trotes leves e tiros curtos de alta intensidade.', imageId: 'corrida-tfm-gif' },
  { id: '42', title: 'Ciclismo', category: 'Cardio', instructions: 'Pedalagem em intensidade moderada ou alta. Excelente para o fôlego e fortalecimento das pernas.', imageId: 'ciclismo-gif' },
  { id: '43', title: 'Corrida Contínua', category: 'Cardio', instructions: 'Corrida com cadência constante, focada em manter o ritmo por tempo ou distância definida.', imageId: 'corrida-img' },
  { id: '44', title: 'Sprint (Tiros)', category: 'Cardio', instructions: 'Corra o mais rápido possível durante um curto período de tempo ou distância definida.', imageId: 'sprint-tiros-gif' }
];
