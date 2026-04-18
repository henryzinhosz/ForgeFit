
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
  { id: '8', title: 'Leg Press 45', category: 'Musculação', instructions: 'Empurre a plataforma com as pernas, evitando o bloqueio total dos joelhos.', imageId: 'musculacao-pernas' },
  { id: '9', title: 'Cadeira Extensora', category: 'Musculação', instructions: 'Sente-se e estenda as pernas contra a resistência do rolo.', imageId: 'musculacao-pernas' },
  { id: '10', title: 'Mesa Flexora', category: 'Musculação', instructions: 'Deitado, flexione as pernas trazendo o rolo em direção ao glúteo.', imageId: 'musculacao-pernas' },
  { id: '11', title: 'Supino Inclinado com Halteres', category: 'Musculação', instructions: 'Banco inclinado a 45 graus, empurre os halteres para cima e para o centro.', imageId: 'musculacao-peito' },
  { id: '12', title: 'Crucifixo Reto', category: 'Musculação', instructions: 'Deitado, abra os braços com os halteres e feche-os acima do peito com os cotovelos levemente flexionados.', imageId: 'musculacao-peito' },
  { id: '13', title: 'Puxada Frontal', category: 'Musculação', instructions: 'Sente-se no pulley e puxe a barra em direção à parte superior do peito.', imageId: 'musculacao-costas' },
  { id: '14', title: 'Elevação Lateral', category: 'Musculação', instructions: 'Em pé, eleve os halteres lateralmente até a altura dos ombros.', imageId: 'musculacao-ombros' },
  { id: '15', title: 'Encolhimento de Ombros', category: 'Musculação', instructions: 'Segure halteres ou barra e eleve os ombros em direção às orelhas.', imageId: 'musculacao-ombros' },
  { id: '16', title: 'Panturrilha em Pé', category: 'Musculação', instructions: 'Fique na ponta dos pés e desça o calcanhar abaixo da linha do degrau.', imageId: 'musculacao-pernas' },
  { id: '17', title: 'Afundo com Halteres', category: 'Musculação', instructions: 'Dê um passo à frente e desça o joelho de trás em direção ao chão.', imageId: 'musculacao-pernas' },
  { id: '18', title: 'Puxada Triângulo', category: 'Musculação', instructions: 'Puxe o suporte em triângulo em direção ao peito, focando na contração das costas.', imageId: 'musculacao-costas' },
  { id: '19', title: 'Stiff', category: 'Musculação', instructions: 'Desça a barra mantendo as pernas quase esticadas e a coluna reta, sentindo o posterior da coxa.', imageId: 'musculacao-pernas' },
  { id: '20', title: 'Pec Deck (Voador)', category: 'Musculação', instructions: 'Sente-se e feche os braços à frente do corpo contra a resistência da máquina.', imageId: 'musculacao-peito' },

  // Calistenia
  { id: '21', title: 'Flexão de Braços', category: 'Calistenia', instructions: 'Corpo reto, desça o peito até o chão e empurre de volta.', imageId: 'calistenia-geral' },
  { id: '22', title: 'Barra Fixa (Pull-up)', category: 'Calistenia', instructions: 'Segure a barra e puxe o corpo até o queixo passar da barra.', imageId: 'calistenia-geral' },
  { id: '23', title: 'Paralelas (Dips)', category: 'Calistenia', instructions: 'Apoie-se nas barras paralelas e desça o corpo flexionando os cotovelos.', imageId: 'calistenia-geral' },
  { id: '24', title: 'Barra Australiana', category: 'Calistenia', instructions: 'Puxe o peito em direção a uma barra baixa mantendo os calcanhares no chão.', imageId: 'calistenia-geral' },
  { id: '25', title: 'Prancha Abdominal', category: 'Calistenia', instructions: 'Apoie-se nos antebraços e pontas dos pés, mantendo o abdômen contraído.', imageId: 'abs-workout' },
  { id: '26', title: 'Abdominal Supra', category: 'Calistenia', instructions: 'Deitado, flexione o tronco em direção aos joelhos.', imageId: 'abs-workout' },
  { id: '27', title: 'Elevação de Pernas', category: 'Calistenia', instructions: 'Pendurado ou deitado, eleve as pernas esticadas.', imageId: 'abs-workout' },
  { id: '28', title: 'Burpees', category: 'Calistenia', instructions: 'Flexão, salto e polichinelo em um movimento fluido.', imageId: 'calistenia-geral' },
  { id: '29', title: 'Mountain Climbers', category: 'Calistenia', instructions: 'Posição de flexão, traga os joelhos em direção ao peito alternadamente.', imageId: 'abs-workout' },
  { id: '30', title: 'Ponte de Glúteo', category: 'Calistenia', instructions: 'Deitado, eleve o quadril em direção ao teto contraindo os glúteos.', imageId: 'calistenia-geral' },
  { id: '31', title: 'Agachamento Sumô', category: 'Calistenia', instructions: 'Pés bem afastados, pontas para fora, agache mantendo o tronco ereto.', imageId: 'musculacao-pernas' },
  { id: '32', title: 'Polichinelo', category: 'Calistenia', instructions: 'Salte abrindo pernas e braços simultaneamente.', imageId: 'cardio-corrida' },
  { id: '33', title: 'Flexão Diamante', category: 'Calistenia', instructions: 'Flexão com as mãos juntas formando um diamante sob o peito.', imageId: 'calistenia-geral' },
  { id: '34', title: 'Walking Lunges', category: 'Calistenia', instructions: 'Afundo alternado caminhando para frente.', imageId: 'musculacao-pernas' },
  { id: '35', title: 'Superman', category: 'Calistenia', instructions: 'Deitado de bruços, eleve braços e pernas simultaneamente.', imageId: 'abs-workout' },

  // Cardio
  { id: '36', title: 'Corrida de Rua', category: 'Cardio', instructions: 'Corrida em ritmo constante ou intervalado.', imageId: 'cardio-corrida' },
  { id: '37', title: 'Ciclismo', category: 'Cardio', instructions: 'Pedalar em estrada ou trilha.', imageId: 'cardio-ciclismo' },
  { id: '38', title: 'Pular Corda', category: 'Cardio', instructions: 'Saltos coordenados com o movimento da corda.', imageId: 'cardio-corrida' },
  { id: '39', title: 'Natação', category: 'Cardio', instructions: 'Nado livre ou estilos variados.', imageId: 'cardio-corrida' },
  { id: '40', title: 'Caminhada Rápida', category: 'Cardio', instructions: 'Caminhada vigorosa mantendo frequência cardíaca elevada.', imageId: 'cardio-corrida' },
  { id: '41', title: 'Trote', category: 'Cardio', instructions: 'Corrida leve para aquecimento ou recuperação.', imageId: 'cardio-corrida' },
  { id: '42', title: 'Escadaria', category: 'Cardio', instructions: 'Subir e descer degraus continuamente.', imageId: 'cardio-corrida' },
  { id: '43', title: 'Remo Seco', category: 'Cardio', instructions: 'Simulador de remo para condicionamento cardiovascular.', imageId: 'cardio-corrida' },
  { id: '44', title: 'Elíptico', category: 'Cardio', instructions: 'Movimento coordenado de pernas e braços na máquina.', imageId: 'cardio-corrida' },
  { id: '45', title: 'HIIT', category: 'Cardio', instructions: 'Treino intervalado de alta intensidade.', imageId: 'cardio-corrida' },
  { id: '46', title: 'Spinning', category: 'Cardio', instructions: 'Aula de ciclismo indoor com ritmos variados.', imageId: 'cardio-ciclismo' },
  { id: '47', title: 'Boxe (Saco de Pancadas)', category: 'Cardio', instructions: 'Golpes coordenados no saco de pancadas.', imageId: 'calistenia-geral' },
  { id: '48', title: 'Step', category: 'Cardio', instructions: 'Exercícios aeróbicos subindo e descendo da plataforma.', imageId: 'cardio-corrida' },
  { id: '49', title: 'Dança Aeróbica', category: 'Cardio', instructions: 'Movimentos coreografados para queima calórica.', imageId: 'cardio-corrida' },
  { id: '50', title: 'Sprints (Tiros)', category: 'Cardio', instructions: 'Corridas de curtíssima distância em velocidade máxima.', imageId: 'cardio-corrida' },
];
