export interface Exercise {
  id: string;
  title: string;
  category: 'Musculação' | 'Calistenia' | 'Cardio';
  instructions: string;
  imageHint: string;
}

export const EXERCISE_DATABASE: Exercise[] = [
  // Musculação
  { id: '1', title: 'Supino Reto', category: 'Musculação', instructions: 'Deite-se no banco, segure a barra com as mãos um pouco mais largas que os ombros. Desça até o peito e empurre.', imageHint: 'chest press' },
  { id: '2', title: 'Agachamento Livre', category: 'Musculação', instructions: 'Pés na largura dos ombros, desça o quadril como se fosse sentar em uma cadeira, mantendo a coluna ereta.', imageHint: 'squat' },
  { id: '3', title: 'Levantamento Terra', category: 'Musculação', instructions: 'Pés na largura do quadril, coluna neutra, puxe a barra do chão estendendo quadril e joelhos.', imageHint: 'deadlift' },
  { id: '4', title: 'Desenvolvimento Militar', category: 'Musculação', instructions: 'Em pé, empurre a barra acima da cabeça até estender os braços completamente.', imageHint: 'shoulder press' },
  { id: '5', title: 'Remada Curvada', category: 'Musculação', instructions: 'Incline o tronco, mantenha a coluna reta e puxe a barra em direção ao abdômen.', imageHint: 'barbell row' },
  { id: '6', title: 'Rosca Direta', category: 'Musculação', instructions: 'Em pé, flexione os cotovelos trazendo a barra em direção aos ombros.', imageHint: 'bicep curl' },
  { id: '7', title: 'Tríceps Corda', category: 'Musculação', instructions: 'Na polia alta, estenda os braços para baixo separando as pontas da corda.', imageHint: 'tricep extension' },
  { id: '8', title: 'Leg Press 45', category: 'Musculação', instructions: 'Empurre a plataforma com as pernas, evitando o bloqueio total dos joelhos.', imageHint: 'leg press' },
  { id: '9', title: 'Cadeira Extensora', category: 'Musculação', instructions: 'Sente-se e estenda as pernas contra a resistência do rolo.', imageHint: 'leg extension' },
  { id: '10', title: 'Mesa Flexora', category: 'Musculação', instructions: 'Deitado, flexione as pernas trazendo o rolo em direção ao glúteo.', imageHint: 'leg curl' },
  { id: '11', title: 'Supino Inclinado com Halteres', category: 'Musculação', instructions: 'Banco inclinado a 45 graus, empurre os halteres para cima e para o centro.', imageHint: 'incline dumbbell press' },
  { id: '12', title: 'Crucifixo Reto', category: 'Musculação', instructions: 'Deitado, abra os braços com os halteres e feche-os acima do peito com os cotovelos levemente flexionados.', imageHint: 'chest fly' },
  { id: '13', title: 'Puxada Frontal', category: 'Musculação', instructions: 'Sente-se no pulley e puxe a barra em direção à parte superior do peito.', imageHint: 'lat pulldown' },
  { id: '14', title: 'Elevação Lateral', category: 'Musculação', instructions: 'Em pé, eleve os halteres lateralmente até a altura dos ombros.', imageHint: 'lateral raise' },
  { id: '15', title: 'Encolhimento de Ombros', category: 'Musculação', instructions: 'Segure halteres ou barra e eleve os ombros em direção às orelhas.', imageHint: 'shrugs' },
  { id: '16', title: 'Panturrilha em Pé', category: 'Musculação', instructions: 'Fique na ponta dos pés e desça o calcanhar abaixo da linha do degrau.', imageHint: 'calf raise' },
  { id: '17', title: 'Afundo com Halteres', category: 'Musculação', instructions: 'Dê um passo à frente e desça o joelho de trás em direção ao chão.', imageHint: 'lunges' },
  { id: '18', title: 'Puxada Triângulo', category: 'Musculação', instructions: 'Puxe o suporte em triângulo em direção ao peito, focando na contração das costas.', imageHint: 'cable row' },
  { id: '19', title: 'Stiff', category: 'Musculação', instructions: 'Desça a barra mantendo as pernas quase esticadas e a coluna reta, sentindo o posterior da coxa.', imageHint: 'stiff leg deadlift' },
  { id: '20', title: 'Pec Deck (Voador)', category: 'Musculação', instructions: 'Sente-se e feche os braços à frente do corpo contra a resistência da máquina.', imageHint: 'pec deck' },

  // Calistenia
  { id: '21', title: 'Flexão de Braços', category: 'Calistenia', instructions: 'Corpo reto, desça o peito até o chão e empurre de volta.', imageHint: 'pushups' },
  { id: '22', title: 'Barra Fixa (Pull-up)', category: 'Calistenia', instructions: 'Segure a barra e puxe o corpo até o queixo passar da barra.', imageHint: 'pullups' },
  { id: '23', title: 'Paralelas (Dips)', category: 'Calistenia', instructions: 'Apoie-se nas barras paralelas e desça o corpo flexionando os cotovelos.', imageHint: 'dips exercise' },
  { id: '24', title: 'Barra Australiana', category: 'Calistenia', instructions: 'Puxe o peito em direção a uma barra baixa mantendo os calcanhares no chão.', imageHint: 'australian pullups' },
  { id: '25', title: 'Prancha Abdominal', category: 'Calistenia', instructions: 'Apoie-se nos antebraços e pontas dos pés, mantendo o abdômen contraído.', imageHint: 'plank' },
  { id: '26', title: 'Abdominal Supra', category: 'Calistenia', instructions: 'Deitado, flexione o tronco em direção aos joelhos.', imageHint: 'crunches' },
  { id: '27', title: 'Elevação de Pernas', category: 'Calistenia', instructions: 'Pendurado ou deitado, eleve as pernas esticadas.', imageHint: 'leg raises' },
  { id: '28', title: 'Burpees', category: 'Calistenia', instructions: 'Flexão, salto e polichinelo em um movimento fluido.', imageHint: 'burpees' },
  { id: '29', title: 'Mountain Climbers', category: 'Calistenia', instructions: 'Posição de flexão, traga os joelhos em direção ao peito alternadamente.', imageHint: 'mountain climbers' },
  { id: '30', title: 'Ponte de Glúteo', category: 'Calistenia', instructions: 'Deitado, eleve o quadril em direção ao teto contraindo os glúteos.', imageHint: 'glute bridge' },
  { id: '31', title: 'Agachamento Sumô', category: 'Calistenia', instructions: 'Pés bem afastados, pontas para fora, agache mantendo o tronco ereto.', imageHint: 'sumo squat' },
  { id: '32', title: 'Polichinelo', category: 'Calistenia', instructions: 'Salte abrindo pernas e braços simultaneamente.', imageHint: 'jumping jacks' },
  { id: '33', title: 'Flexão Diamante', category: 'Calistenia', instructions: 'Flexão com as mãos juntas formando um diamante sob o peito.', imageHint: 'diamond pushups' },
  { id: '34', title: 'Walking Lunges', category: 'Calistenia', instructions: 'Afundo alternado caminhando para frente.', imageHint: 'walking lunges' },
  { id: '35', title: 'Superman', category: 'Calistenia', instructions: 'Deitado de bruços, eleve braços e pernas simultaneamente.', imageHint: 'superman exercise' },

  // Cardio
  { id: '36', title: 'Corrida de Rua', category: 'Cardio', instructions: 'Corrida em ritmo constante ou intervalado.', imageHint: 'running' },
  { id: '37', title: 'Ciclismo', category: 'Cardio', instructions: 'Pedalar em estrada ou trilha.', imageHint: 'cycling' },
  { id: '38', title: 'Pular Corda', category: 'Cardio', instructions: 'Saltos coordenados com o movimento da corda.', imageHint: 'jump rope' },
  { id: '39', title: 'Natação', category: 'Cardio', instructions: 'Nado livre ou estilos variados.', imageHint: 'swimming' },
  { id: '40', title: 'Caminhada Rápida', category: 'Cardio', instructions: 'Caminhada vigorosa mantendo frequência cardíaca elevada.', imageHint: 'walking fast' },
  { id: '41', title: 'Trote', category: 'Cardio', instructions: 'Corrida leve para aquecimento ou recuperação.', imageHint: 'jogging' },
  { id: '42', title: 'Escadaria', category: 'Cardio', instructions: 'Subir e descer degraus continuamente.', imageHint: 'stairs exercise' },
  { id: '43', title: 'Remo Seco', category: 'Cardio', instructions: 'Simulador de remo para condicionamento cardiovascular.', imageHint: 'rowing machine' },
  { id: '44', title: 'Elíptico', category: 'Cardio', instructions: 'Movimento coordenado de pernas e braços na máquina.', imageHint: 'elliptical' },
  { id: '45', title: 'HIIT', category: 'Cardio', instructions: 'Treino intervalado de alta intensidade.', imageHint: 'hiit' },
  { id: '46', title: 'Spinning', category: 'Cardio', instructions: 'Aula de ciclismo indoor com ritmos variados.', imageHint: 'spinning class' },
  { id: '47', title: 'Boxe (Saco de Pancadas)', category: 'Cardio', instructions: 'Golpes coordenados no saco de pancadas.', imageHint: 'boxing workout' },
  { id: '48', title: 'Step', category: 'Cardio', instructions: 'Exercícios aeróbicos subindo e descendo da plataforma.', imageHint: 'step aerobics' },
  { id: '49', title: 'Dança Aeróbica', category: 'Cardio', instructions: 'Movimentos coreografados para queima calórica.', imageHint: 'dance workout' },
  { id: '50', title: 'Sprints (Tiros)', category: 'Cardio', instructions: 'Corridas de curtíssima distância em velocidade máxima.', imageHint: 'sprints' },
];
