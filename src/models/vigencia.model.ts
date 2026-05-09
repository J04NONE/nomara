export interface VigenciaNormativa {
  id: string;
  fechaInicio: string;
  divisor: number;
  pctNocturno: number;
  pctDominical: number;
}

export interface CreateVigenciaDto {
  fechaInicio: string;
  divisor: number;
  pctNocturno: number;
  pctDominical: number;
}
