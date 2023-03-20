import { RiskTolerance } from "./RiskTolerance.enum";

export interface InvestorInfo {
    age: number;
    targetRetirementAge?: number;
    riskTolerance?: RiskTolerance;
}