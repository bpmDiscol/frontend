import employeeRequestSchema from "./employeeRequestSchema";

export function validateEmployeeRequest(data) {
  try {
    employeeRequestSchema.parse(data);
  } catch (error) {
    return error;
  }
}

export function processInterviews(interviewsData) {
  return interviewsData.map((currentInterviewInput) => {
    return {
      aboutBusinessBoss: currentInterviewInput.aboutBusinessBoss || "",
      aboutBusinessMotive: currentInterviewInput.aboutBusinessMotive || "",
      aboutBusinessName: currentInterviewInput.aboutBusinessName || "",
      academicLevel: currentInterviewInput.academicLevel || "",
      age: parseInt(currentInterviewInput.age || 0),
      applicationType: currentInterviewInput.applicationType || "",
      city: currentInterviewInput.city || "",
      currentForm: currentInterviewInput.currentForm || 0,
      email: currentInterviewInput.email || "",
      expectedPosition: currentInterviewInput.expectedPosition || "",
      finalConcept: currentInterviewInput.finalConcept || "",
      grade: currentInterviewInput.grade || "",
      id: currentInterviewInput.id || "",
      interviewId: currentInterviewInput.interviewId || "",
      isAboutBussiness: currentInterviewInput.isAboutBussiness || false,
      isAboutFamily: currentInterviewInput.isAboutFamily || false,
      isEvaluationControl: currentInterviewInput.isEvaluationControl || "",
      isEvaluationFocus: currentInterviewInput.isEvaluationFocus || "",
      isEvaluationLearning: currentInterviewInput.isEvaluationLearning || "",
      isEvaluationOrientation:
        currentInterviewInput.isEvaluationOrientation || "",
      isEvaluationSensibility:
        currentInterviewInput.isEvaluationSensibility || "",
      isLicence: currentInterviewInput.isLicence || false,
      isPreviusEmployee: currentInterviewInput.isPreviusEmployee || false,
      isSOAT: currentInterviewInput.isSOAT || false,
      isTecnomecanica: currentInterviewInput.isTecnomecanica || false,
      isValidDocuments: currentInterviewInput.isValidDocuments || false,
      isValidLicence: currentInterviewInput.isValidLicence || false,
      isVehicle: currentInterviewInput.isVehicle || false,
      kinName: currentInterviewInput.kinName || "",
      kinship: currentInterviewInput.kinship || "",
      learningAdaptation: currentInterviewInput.learningAdaptation || "",
      laboralExperience: currentInterviewInput.laboralExperience || [],
      personalAnnotation: currentInterviewInput.personalAnnotation || "",
      phone: currentInterviewInput.phone || "",
      requiredAcademic: currentInterviewInput.requiredAcademic || "",
      requiredCompetences: currentInterviewInput.requiredCompetences || "",
      requiredExperience: currentInterviewInput.requiredExperience || "",
      residence: currentInterviewInput.residence || "",
      retirementDate: currentInterviewInput.retirementDate || "",
      retirementMotive: currentInterviewInput.retirementMotive || "",
      revisionVial: currentInterviewInput.revisionVial || "",
      salaryGoal: currentInterviewInput.salaryGoal || "",
      selected: currentInterviewInput.selected || false,
      sizePants: currentInterviewInput.sizePants || "",
      sizeShirt: currentInterviewInput.sizeShirt || "",
      sizeShoes: currentInterviewInput.sizeShoes || "",
      status: currentInterviewInput.status || "",
      study: currentInterviewInput.study || [],
      systemKnown: currentInterviewInput.systemKnown || [],
      tecnicalEvaluation: currentInterviewInput.tecnicalEvaluation || "",
      tecnicalknowledge: currentInterviewInput.tecnicalknowledge || "",
      vehicle_owner_id: currentInterviewInput.vehicle_owner_id || "",
      vehicle_owner_name: currentInterviewInput.vehicle_owner_name || "",
      vechiclePlate: currentInterviewInput.vechiclePlate || "",
    };
  });
}

export function verifyGears(inputData) {
  inputData = inputData || {};

  return {
    isDesktopPC: inputData.isDesktopPC ?? false,
    isLaptop: inputData.isLaptop ?? false,
    isScreen: inputData.isScreen ?? false,
    isKeyboard: inputData.isKeyboard ?? false,
    isMouse: inputData.isMouse ?? false,
    isEmail: inputData.isEmail ?? false,
    isDesk: inputData.isDesk ?? false,
    isChair: inputData.isChair ?? false,
    isHeadset: inputData.isHeadset ?? false,
    isCelphone: inputData.isCelphone ?? false,
    isOther: inputData.isOther ?? false,
    other: inputData.other || [],
  };
}

export function validateRequest(request){
    return{
        contractType: request?.contractType,
        workingDayType: request?.workingDayType,
        motive: request?.motive,
        requestEmployeeDataInput: {
          site: request?.site,
          companyPosition: request?.companyPosition,
          area_proyect: request?.area_proyect,
          isHandbookFunction: request?.isHandbookFunction || false,
          workPlace: request?.workPlace,
          vacancies: parseInt(request?.vacancies || 0),
          duration: {
            cuantity: parseInt(request?.duration?.cuantity || -1),
            timePart: request?.duration?.timePart || "mes",
          },
          salary: parseFloat(request?.salary || 0),
          isBonus: request?.isBonus || false,
          bonusesFrecuency: {
            cuantity: parseInt(request?.bonusesFrecuency?.cuantity || -1),
            timePart: request?.bonusesFrecuency?.timePart || "indefinido",
          },
          isVehicle: request?.isVehicle || false,
          vehicleType: request?.vehicleType || "",
          licenceType: request?.licenceType || "",
          bearingValue: parseFloat(request?.bearingValue || 0),
          workingDay: {
            isFullTime: false,
            isPartTime: false,
            isDayTime: false,
            isRemote: false,
          },
          motive: {
            isNewCharge: false,
            isEmployeeExpanding: false,
            isLicence: false,
            isNewProject: false,
            isReplacement: false,
            isEmployeeInhability: false,
          },
          contractType: {
            isContractedLabor: false,
            isUndefined: false,
            isFixedTerm: false,
            isLearning: false,
          },
          gears: verifyGears(request?.gears),
          requirements: request?.requirements || "",
          observations: [request?.observations || "::::::::::::NO SE INTRODUJERON OBSERVACIONES::::::::"],
        },
      };
}