import { Meteor } from "meteor/meteor";
import { validateEmployeeRequest } from "../misc/validation";

function justTrueInObject(attribute, keys) {
  const result = {};
  keys.forEach((key) => {
    result[key] = attribute == key ? true : false;
  });
  return result;
}

function processInterviews(interviewsData) {
  return interviewsData.map((currentInterviewInput) => {
    return {
      aboutBusinessBoss: currentInterviewInput.aboutBusinessBoss || "",
      aboutBusinessMotive: currentInterviewInput.aboutBusinessMotive || "",
      aboutBusinessName: currentInterviewInput.aboutBusinessName || "",
      academicLevel: currentInterviewInput.academicLevel || "",
      age: parseInt(currentInterviewInput.age || 0),
      applicationType: currentInterviewInput.applicationType || "",
      business_labour_1: currentInterviewInput.business_labour_1 || "",
      business_labour_2: currentInterviewInput.business_labour_2 || "",
      business_motive_1: currentInterviewInput.business_motive_1 || "",
      business_motive_2: currentInterviewInput.business_motive_2 || "",
      business_name_1: currentInterviewInput.business_name_1 || "",
      business_name_2: currentInterviewInput.business_name_2 || "",
      business_time_1: currentInterviewInput.business_time_1 || "",
      business_time_2: currentInterviewInput.business_time_2 || "",
      city: currentInterviewInput.city || "",
      currentForm: currentInterviewInput.currentForm || 0,
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

function verifyGears(inputData) {
  inputData = inputData || {};
  return {
    isDesktopPC: inputData.gears?.isDesktopPC ?? false,
    isLaptop: inputData.gears?.isLaptop ?? false,
    isScreen: inputData.gears?.isScreen ?? false,
    isKeyboard: inputData.gears?.isKeyboard ?? false,
    isMouse: inputData.gears?.isMouse ?? false,
    isEmail: inputData.gears?.isEmail ?? false,
    isDesk: inputData.gears?.isDesk ?? false,
    isChair: inputData.gears?.isChair ?? false,
    isHeadset: inputData.gears?.isHeadset ?? false,
    isCelphone: inputData.gears?.isCelphone ?? false,
    isOther: inputData.isOther ?? false,
    other: inputData.other || [],
  };
}

Meteor.methods({
  async get_employee_request() {
    const taskId = await Meteor.callAsync("get_task_id");
    const context = await Meteor.callAsync("get_context", { taskId });

    if (context)
      return await Meteor.callAsync("get_data", {
        url: context?.requestEmployeeData_ref?.link,
        params: {},
      });
  },
  async get_employee_request_data(taskId) {
    const context = await Meteor.callAsync("get_context", { taskId });

    if (context)
      return await Meteor.callAsync("get_data", {
        url: context?.requestEmployeeData_ref?.link,
        params: {},
      });
  },

  async get_request_process({ currentTask }) {
    const taskId = currentTask
      ? currentTask
      : await Meteor.callAsync("get_task_id");
    const context = await Meteor.callAsync("get_context", { taskId });

    if (context)
      return await Meteor.callAsync("get_data", {
        url: context?.requestProcess_ref?.link,
        params: {},
      });
    return {};
  },

  async send_employee_request({ response, concept }) {
    const { username, taskId } = Meteor.users.findOne(Meteor.userId());
    return await Meteor.callAsync("post_data", {
      url: `/API/bpm/userTask/${taskId}/execution`,
      data: {
        concept,
        responsible: username,
        response,
      },
    });
  },
  async start_employee_request({ request, processId }) {
    const data = {
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
          cuantity: parseInt(request?.duration?.cuantity || 0),
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
        observations: [request?.observations || ""],
      },
    };
    const errorValidation = validateEmployeeRequest(data);
    if (errorValidation) {
      return { error: true, issues: errorValidation.issues };
    }
    return await Meteor.callAsync("post_data", {
      url: `/API/bpm/process/${processId}/instantiation`,
      data,
    });
  },
  async send_curricullums({ curricullumsInput }) {
    const { username, taskId } = Meteor.users.findOne(Meteor.userId());
    return await Meteor.callAsync("post_data", {
      url: `/API/bpm/userTask/${taskId}/execution`,
      data: {
        curricullumsInput,
        responsible: username,
      },
    });
  },
  async get_curricullums() {
    const { taskId } = Meteor.users.findOne(Meteor.userId());
    const context = await Meteor.callAsync("get_context", { taskId });

    if (context)
      return await Meteor.callAsync("get_data", {
        url: context?.curricullums_ref?.link,
        params: {},
      });
  },

  async send_interviews(iData) {
    const { username, taskId } = Meteor.users.findOne(Meteor.userId());
    const interviewInput = processInterviews(iData);

    return await Meteor.callAsync("post_data", {
      url: `/API/bpm/userTask/${taskId}/execution`,
      data: {
        interviewInput,
        responsible: username,
      },
    });
  },
  async get_interviews() {
    const { taskId } = Meteor.users.findOne(Meteor.userId());
    const context = await Meteor.callAsync("get_context", { taskId });

    if (context)
      return await Meteor.callAsync("get_data", {
        url: context?.interview_ref?.link,
        params: {},
      });
  },
});
