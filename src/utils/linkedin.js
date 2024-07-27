import { LINKEDIN_TO_SUMMARY_PROMPT } from "./../../prompts";
import { askGPT } from "./gpt";

const getQuickSummary = async (entireLinkedinDump) => {
  const quickSummary2 = await askGPT(
    LINKEDIN_TO_SUMMARY_PROMPT,
    entireLinkedinDump
  );

  return quickSummary2;
};

const getWorkHistory = (profileExp) => {
  if (profileExp) {
    const title = profileExp?.title || "";
    const companyName = profileExp?.companyName || "";
    const location = profileExp?.location || "";
    const startYear = profileExp?.startYear || "";
    const endYear = profileExp?.endYear || "";

    const line1 = title + (companyName ? " @ " + companyName : "") + "\n";
    const line2 = location ? location + "\n" : "";
    const line3 = startYear
      ? startYear + (endYear ? " - " + endYear : " - Present") + "\n"
      : "";
    const quickSummary = line1 + line2 + line3;
    return quickSummary;
  } else {
    return "";
  }
};

const getWorkHistoryList = (data) => {
  if (!data || !data?.work_experience || !Array.isArray(data?.work_experience))
    return "";

  const firstProfileExperiences = data?.work_experience
    .filter(
      (group) =>
        group &&
        group?.profile_positions &&
        Array.isArray(group?.profile_positions) &&
        group?.profile_positions?.length > 0
    )
    .map((group) => {
      const firstPosition = group?.profile_positions?.[0];

      const allFirstYears = group?.profile_positions
        .filter((position) => position?.date?.start?.year != null)
        .map((position) => position?.date?.start?.year)
        .sort();
      const allLastYears = group?.profile_positions
        .filter((position) => position?.date?.end?.year != null)
        .map((position) => position?.date?.end?.year)
        .sort();

      return {
        title: firstPosition?.title || "",
        companyName: firstPosition?.company || "",
        location: firstPosition?.location || "",
        startYear: allFirstYears?.length > 0 ? allFirstYears?.[0] || "" : null,
        endYear:
          allLastYears?.length > 0
            ? allLastYears?.[allLastYears?.length - 1]
            : null,
      };
    });

  return firstProfileExperiences?.map(getWorkHistory).join("\n\n");
};

const getEducationList = (data) => {
  if (data?.education && Array.isArray(data?.education)) {
    return data?.education
      ?.map((edu) => {
        const schoolName = edu?.school?.name || "";
        const degree = edu?.degree_name ? `${edu.degree_name} ` : "";
        const fieldOfStudy = edu?.field_of_study?.join(" ") || "";
        const startYear = edu?.date?.start?.year || "";
        const endYear = edu?.date?.end?.year || "";

        return `${schoolName}\n${degree}${
          fieldOfStudy ? `${fieldOfStudy}\n` : ""
        }${startYear} - ${endYear}\n`;
      })
      .join("\n\n");
  } else {
    return "";
  }
};

export { getQuickSummary, getWorkHistoryList, getEducationList };
