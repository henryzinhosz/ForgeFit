/**
 * @fileOverview Utilitários de saúde baseados em lógica matemática determinística.
 * Segue rigorosamente os parâmetros da OMS (IMC) e Harris-Benedict (TMB).
 */

export type Gender = 'Masculino' | 'Feminino';

export interface HealthMetrics {
  weight: number;
  height: number;
  age: number;
  gender: Gender;
}

export interface HealthAssessment {
  bmi: number;
  bmiClassification: string;
  tmb: number;
  get: number;
  waterLiters: number;
  proteinRange: { min: number; max: number };
  isValid: boolean;
  error?: string;
}

/**
 * Valida se os dados inseridos são realistas para evitar erros de cálculo.
 */
export function validateHealthData(metrics: HealthMetrics): { isValid: boolean; error?: string } {
  const { weight, height, age } = metrics;
  
  if (weight < 30 || weight > 300) return { isValid: false, error: "Peso fora dos limites realistas (30kg - 300kg)." };
  if (height < 100 || height > 250) return { isValid: false, error: "Altura fora dos limites realistas (100cm - 250cm)." };
  if (age < 12 || age > 120) return { isValid: false, error: "Idade fora dos limites realistas (12 - 120 anos)." };
  
  // Cálculo prévio de IMC para validação
  const hInMeters = height / 100;
  const bmi = weight / (hInMeters * hInMeters);
  if (bmi > 100) return { isValid: false, error: "Dados resultam em IMC irreal (> 100)." };

  return { isValid: true };
}

/**
 * Calcula o IMC e retorna a classificação oficial da OMS.
 */
export function calculateBMI(weight: number, heightCm: number): { value: number; classification: string } {
  const heightInMeters = heightCm / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  const value = parseFloat(bmi.toFixed(1));

  let classification = "";
  if (value < 18.5) classification = "Abaixo do peso";
  else if (value < 25.0) classification = "Peso normal";
  else if (value < 30.0) classification = "Sobrepeso";
  else if (value < 35.0) classification = "Obesidade Grau I";
  else if (value < 40.0) classification = "Obesidade Grau II";
  else classification = "Obesidade Grau III (Mórbida)";

  return { value, classification };
}

/**
 * Calcula a Taxa Metabólica Basal usando a Equação de Harris-Benedict Revisada.
 * GET (Gasto Energético Total) calculado com fator de atividade 1.55 (Moderado).
 */
export function calculateMetabolism(metrics: HealthMetrics): { tmb: number; get: number } {
  const { weight, height, age, gender } = metrics;
  let tmb = 0;

  if (gender === 'Masculino') {
    tmb = 66.47 + (13.75 * weight) + (5.0 * height) - (6.75 * age);
  } else {
    tmb = 655.1 + (9.56 * weight) + (1.85 * height) - (4.67 * age);
  }

  const get = tmb * 1.55;
  return { 
    tmb: parseFloat(tmb.toFixed(1)), 
    get: parseFloat(get.toFixed(1)) 
  };
}

/**
 * Calcula metas de hidratação (35ml/kg) e proteína (1.8g - 2.2g/kg).
 */
export function calculateNutrients(weight: number): { water: number; protein: { min: number; max: number } } {
  const water = (35 * weight) / 1000; // Converte ml para Litros
  return {
    water: parseFloat(water.toFixed(1)),
    protein: {
      min: parseFloat((1.8 * weight).toFixed(1)),
      max: parseFloat((2.2 * weight).toFixed(1))
    }
  };
}

/**
 * Controlador central de cálculos de saúde.
 */
export function getHealthAssessment(metrics: HealthMetrics): HealthAssessment {
  const validation = validateHealthData(metrics);
  if (!validation.isValid) {
    return {
      bmi: 0, bmiClassification: "", tmb: 0, get: 0, waterLiters: 0,
      proteinRange: { min: 0, max: 0 }, isValid: false, error: validation.error
    };
  }

  const bmiInfo = calculateBMI(metrics.weight, metrics.height);
  const metabolism = calculateMetabolism(metrics);
  const nutrients = calculateNutrients(metrics.weight);

  return {
    bmi: bmiInfo.value,
    bmiClassification: bmiInfo.classification,
    tmb: metabolism.tmb,
    get: metabolism.get,
    waterLiters: nutrients.water,
    proteinRange: nutrients.protein,
    isValid: true
  };
}
