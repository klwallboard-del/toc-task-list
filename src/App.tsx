import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X, Plus } from "lucide-react";

interface CoreResponsibility {
  primary: string;
  secondary: string;
}

interface InfraCheck {
  primary: string;
}

interface LunchBreak {
  time: string;
  staff: string;
}

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isNightShift, setIsNightShift] = useState(false);
  const [flashingTasks, setFlashingTasks] = useState<Record<string, boolean>>({});

  const staffList = [
    "ALL",
    "Akmal",
    "Shantini",
    "Leonard",
    "Jazman",
    "Ela",
    "Muthu",
    "Thnalan",
    "Hafizi",
    "Danial",
    "Vithy",
  ];

  const tocTasks = [
    "TOC Phone Line",
    "FreshService - Alerts",
    "FreshService - INC",
    "FreshService - SR",
  ];

  const [coreResponsibilities, setCoreResponsibilities] = useState<
    Record<string, CoreResponsibility>
  >(
    tocTasks.reduce(
      (acc, task) => ({
        ...acc,
        [task]: { primary: "", secondary: "" },
      }),
      {}
    )
  );

  const [infraChecks, setInfraChecks] = useState<Record<string, InfraCheck>>({
    "Daily Zerto Checks": { primary: "" },
    "Daily AIP Backup Checks": { primary: "" },
  });

  const [phoneAccountability, setPhoneAccountability] = useState<
    Record<string, string[]>
  >({});

  const [lunchBreaks, setLunchBreaks] = useState<LunchBreak[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCore = localStorage.getItem("coreResponsibilities");
    const savedInfra = localStorage.getItem("infraChecks");
    const savedLunch = localStorage.getItem("lunchBreaks");

    if (savedCore) {
      try {
        setCoreResponsibilities(JSON.parse(savedCore));
      } catch (e) {
        console.error("Failed to load core responsibilities", e);
      }
    }

    if (savedInfra) {
      try {
        setInfraChecks(JSON.parse(savedInfra));
      } catch (e) {
        console.error("Failed to load infra checks", e);
      }
    }

    if (savedLunch) {
      try {
        setLunchBreaks(JSON.parse(savedLunch));
      } catch (e) {
        console.error("Failed to load lunch breaks", e);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("coreResponsibilities", JSON.stringify(coreResponsibilities));
  }, [coreResponsibilities]);

  useEffect(() => {
    localStorage.setItem("infraChecks", JSON.stringify(infraChecks));
  }, [infraChecks]);

  useEffect(() => {
    localStorage.setItem("lunchBreaks", JSON.stringify(lunchBreaks));
  }, [lunchBreaks]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      const hour = now.getHours();
      const minute = now.getMinutes();
      setIsNightShift(hour >= 20 || hour < 8);
      
      // Check if it's time for infrastructure checks (flash for 1 minute only)
      const newFlashingTasks: Record<string, boolean> = {};
      
      // Daily Zerto Checks - 9 AM or 9 PM for 1 minute
      if ((hour === 9 || hour === 21) && minute === 0) {
        newFlashingTasks["Daily Zerto Checks"] = true;
      }
      
      // Daily AIP Backup Checks - 6PM or 12AM (flash for 1 minute: 18:00-18:00:59 or 0:00-0:00:59)
      if ((hour === 18 || hour === 0) && minute === 0) {
        newFlashingTasks["Daily AIP Backup Checks"] = true;
      }
      
      setFlashingTasks(newFlashingTasks);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const hours: Record<string, string[]> = {};
    if (isNightShift) {
      // Night shift: 20:00 to 7:00 (next day)
      for (let i = 20; i <= 23; i++) {
        hours[`${i}:00`] = [];
      }
      for (let i = 0; i <= 7; i++) {
        hours[`${String(i).padStart(2, '0')}:00`] = [];
      }
    } else {
      // Day shift: 8:00 to 19:00
      for (let i = 8; i <= 19; i++) {
        hours[`${i}:00`] = [];
      }
    }
    setPhoneAccountability(hours);
  }, [isNightShift]);

  const updateCoreResponsibility = (
    task: string,
    type: "primary" | "secondary",
    value: string
  ) => {
    const updated = {
      ...coreResponsibilities,
      [task]: { ...coreResponsibilities[task], [type]: value },
    };
    setCoreResponsibilities(updated);
  };

  const updateInfraCheck = (
    task: string,
    value: string
  ) => {
    const updated = {
      ...infraChecks,
      [task]: { primary: value },
    };
    setInfraChecks(updated);
  };

  const updatePhoneAccountability = (hour: string, staff: string) => {
    const updated = {
      ...phoneAccountability,
      [hour]: [...(phoneAccountability[hour] || []), staff],
    };
    setPhoneAccountability(updated);
  };

  const removePhoneAccountability = (hour: string, staff: string) => {
    const updated = {
      ...phoneAccountability,
      [hour]: phoneAccountability[hour].filter((s) => s !== staff),
    };
    setPhoneAccountability(updated);
  };

  const addLunchBreak = () => {
    const updated = [...lunchBreaks, { time: "", staff: "" }];
    setLunchBreaks(updated);
  };

  const updateLunchBreak = (
    index: number,
    field: "time" | "staff",
    value: string
  ) => {
    const updated = [...lunchBreaks];
    updated[index][field] = value;
    setLunchBreaks(updated);
  };

  const removeLunchBreak = (index: number) => {
    const updated = lunchBreaks.filter((_, i) => i !== index);
    setLunchBreaks(updated);
  };

  const resetAll = () => {
    // Clear localStorage
    localStorage.removeItem("coreResponsibilities");
    localStorage.removeItem("infraChecks");
    localStorage.removeItem("lunchBreaks");
    
    // Reset local state
    setCoreResponsibilities(
      tocTasks.reduce(
        (acc, task) => ({
          ...acc,
          [task]: { primary: "", secondary: "" },
        }),
        {}
      )
    );

    setInfraChecks({
      "Daily Zerto Checks": { primary: "" },
      "Daily AIP Backup Checks": { primary: "" },
    });

    setPhoneAccountability((prev) => {
      const hours: Record<string, string[]> = {};
      if (isNightShift) {
        for (let i = 20; i < 24; i++) {
          hours[`${i}:00`] = [];
        }
        for (let i = 0; i < 8; i++) {
          hours[`${i}:00`] = [];
        }
      } else {
        for (let i = 8; i < 20; i++) {
          hours[`${i}:00`] = [];
        }
      }
      return hours;
    });

    setLunchBreaks([]);
  };

  const getInfraTime = (task: string) => {
    if (task === "Daily Zerto Checks") {
      return isNightShift ? "9PM MYT" : "9AM MYT";
    } else {
      return isNightShift ? "12AM MYT" : "6PM MYT";
    }
  };

  const getLunchTimeOptions = () => {
    return isNightShift
      ? ["12AM", "1AM", "2AM", "3AM"]
      : ["12PM", "1PM", "2PM", "3PM"];
  };

  return (
    <div className="h-screen bg-[#f3f2f1] p-4 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 mb-3">
        <div className="flex justify-between items-center bg-white rounded-md p-4 shadow-sm border border-[#e1dfdd]">
          <h1 className="text-2xl font-semibold text-[#252423]">
            Shift Task List - {(() => {
              const displayDate = new Date(currentTime);
              // If night shift and after midnight (0-7 hours), show previous day
              if (isNightShift && currentTime.getHours() < 8) {
                displayDate.setDate(displayDate.getDate() - 1);
              }
              return displayDate.toLocaleDateString('en-GB');
            })()} - {isNightShift ? "Night Shift" : "Day Shift"}
          </h1>
          <button
            onClick={resetAll}
            className="px-4 py-2 bg-[#c4314b] text-white rounded-md hover:bg-[#a52a3d] transition-colors duration-200 font-medium"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* Dashboard Grid - Left and Right Columns */}
      <div className="flex-1 grid grid-cols-2 gap-4 overflow-hidden">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-4 overflow-hidden">
          {/* Section 1: TOC Core Responsibilities - Top */}
          <Card className="bg-white shadow-sm border border-[#e1dfdd] hover:shadow-md transition-shadow duration-200 flex flex-col overflow-hidden">
            <CardHeader className="bg-[#6264a7] text-white py-3 flex-shrink-0">
              <CardTitle className="text-lg font-semibold">TOC CORE RESPONSIBILITIES</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-[#e1dfdd]">
                      <th className="text-left py-2 px-2 font-semibold text-[#252423]">
                        Task
                      </th>
                      <th className="text-left py-2 px-2 font-semibold text-[#252423]">
                        Primary
                      </th>
                      <th className="text-left py-2 px-2 font-semibold text-[#252423]">
                        Secondary
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tocTasks.map((task) => (
                      <tr
                        key={task}
                        className="border-b border-[#edebe9] hover:bg-[#f3f2f1] transition-colors"
                      >
                        <td className="py-2 px-2 text-xs text-[#252423]">
                          {task}
                        </td>
                        <td className="py-2 px-2">
                          {task === "TOC Phone Line" ? (
                            <div className="text-xs py-2 font-medium text-[#252423]">
                              ALL
                            </div>
                          ) : (
                            <Select
                              value={coreResponsibilities[task].primary}
                              onValueChange={(value) =>
                                updateCoreResponsibility(task, "primary", value)
                              }
                            >
                              <SelectTrigger className={`border-[#8a8886] bg-white focus:ring-[#6264a7] hover:border-[#6264a7] transition-colors h-8 text-xs ${coreResponsibilities[task].primary ? 'text-[#252423] font-bold' : 'text-[#605e5c] font-normal'}`}>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-[#e1dfdd]">
                                {staffList.map((staff) => (
                                  <SelectItem key={staff} value={staff} className="text-[#252423] hover:bg-[#f3f2f1] font-bold">
                                    {staff}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </td>
                        <td className="py-2 px-2">
                          {task === "TOC Phone Line" ? (
                            <div className="text-xs py-2 font-medium text-[#252423]">
                              ALL
                            </div>
                          ) : (
                            <Select
                              value={coreResponsibilities[task].secondary}
                              onValueChange={(value) =>
                                updateCoreResponsibility(task, "secondary", value)
                              }
                            >
                              <SelectTrigger className={`border-[#8a8886] bg-white focus:ring-[#6264a7] hover:border-[#6264a7] transition-colors h-8 text-xs ${coreResponsibilities[task].secondary ? 'text-[#252423] font-bold' : 'text-[#605e5c] font-normal'}`}>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-[#e1dfdd]">
                                {staffList.map((staff) => (
                                  <SelectItem key={staff} value={staff} className="text-[#252423] hover:bg-[#f3f2f1] font-bold">
                                    {staff}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Infrastructure Checks - Bottom */}
          <Card className="bg-white shadow-sm border border-[#e1dfdd] hover:shadow-md transition-shadow duration-200 flex flex-col overflow-hidden">
            <CardHeader className="bg-[#6264a7] text-white py-3 flex-shrink-0">
              <CardTitle className="text-lg font-semibold">INFRASTRUCTURE CHECKS</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-[#e1dfdd]">
                      <th className="text-left py-2 px-2 font-semibold text-[#252423]">
                        Task
                      </th>
                      <th className="text-left py-2 px-2 font-semibold text-[#252423]">
                        Primary
                      </th>
                      <th className="text-left py-2 px-2 font-semibold text-[#252423]">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(infraChecks).map((task) => (
                      <tr
                        key={task}
                        className="border-b border-[#edebe9] transition-colors hover:bg-[#f3f2f1]"
                      >
                        <td className={`py-2 px-2 text-xs ${
                          flashingTasks[task]
                            ? "flash-red-cell text-white font-bold border-2 border-red-500 rounded"
                            : "text-[#252423]"
                        }`}>
                          {task}
                        </td>
                        <td className="py-2 px-2">
                          <Select
                            value={infraChecks[task].primary}
                            onValueChange={(value) =>
                              updateInfraCheck(task, value)
                            }
                          >
                            <SelectTrigger className={`border-[#8a8886] bg-white focus:ring-[#6264a7] hover:border-[#6264a7] transition-colors h-8 text-xs ${infraChecks[task].primary ? 'text-[#252423] font-bold' : 'text-[#605e5c] font-normal'}`}>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-[#e1dfdd]">
                              {staffList.map((staff) => (
                                <SelectItem key={staff} value={staff} className="text-[#252423] hover:bg-[#f3f2f1] font-bold">
                                  {staff}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </td>
                        <td className="py-2 px-2 text-[#605e5c] font-medium text-xs">
                          {getInfraTime(task)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-4 overflow-hidden">
          {/* Section 3: Phone Accountability - Top */}
          <Card className="bg-white shadow-sm border border-[#e1dfdd] hover:shadow-md transition-shadow duration-200 flex flex-col overflow-hidden">
            <CardHeader className="bg-[#6264a7] text-white py-3 flex-shrink-0">
              <CardTitle className="text-lg font-semibold">PHONE ACCOUNTABILITY</CardTitle>
            </CardHeader>
            <CardContent className="p-3 flex-1 overflow-hidden">
              <div className="grid grid-cols-4 gap-2 h-full content-start">
                {Object.keys(phoneAccountability).sort((a, b) => {
                  // Sort hours properly for night shift (20-23, then 0-7) or day shift (8-19)
                  const hourA = parseInt(a.split(':')[0]);
                  const hourB = parseInt(b.split(':')[0]);
                  
                  if (isNightShift) {
                    // Night shift: prioritize 20-23 before 0-7
                    const orderA = hourA >= 20 ? hourA : hourA + 24;
                    const orderB = hourB >= 20 ? hourB : hourB + 24;
                    return orderA - orderB;
                  }
                  return hourA - hourB;
                }).map((hour) => (
                  <div
                    key={hour}
                    className="border-2 border-[#e1dfdd] rounded-lg p-2 bg-white hover:border-[#6264a7] hover:shadow-md transition-all duration-300 flex flex-col"
                  >
                    <div className="flex items-center justify-between mb-1 flex-shrink-0">
                      <div className="flex items-center gap-1">
                        <div className="font-bold text-xs text-[#252423] bg-[#f3f2f1] px-1.5 py-0.5 rounded border border-[#e1dfdd]">
                          {hour}
                        </div>
                        {/* Add Staff Button with + Icon */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border border-[#6264a7] hover:border-[#464775] bg-white hover:bg-[#f3f2f1] transition-all duration-200 w-6 h-6 p-0 flex items-center justify-center"
                            >
                              <Plus className="h-3 w-3 text-[#6264a7]" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-48 p-2 bg-white border-[#e1dfdd]">
                            <div className="max-h-[200px] overflow-auto space-y-1">
                              {staffList
                                .filter(
                                  (staff) =>
                                    staff !== "ALL" &&
                                    !phoneAccountability[hour]?.includes(staff)
                                )
                                .map((staff) => (
                                  <button
                                    key={staff}
                                    onClick={() =>
                                      updatePhoneAccountability(hour, staff)
                                    }
                                    className="w-full text-left px-3 py-1.5 text-sm text-[#252423] hover:bg-[#f3f2f1] rounded transition-colors font-bold"
                                  >
                                    {staff}
                                  </button>
                                ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="text-xs text-[#605e5c] font-medium">
                        {phoneAccountability[hour]?.length || 0}
                      </div>
                    </div>

                    {/* Selected Staff Display */}
                    {phoneAccountability[hour]?.length > 0 && (
                      <div className="mb-1 space-y-1 flex-1 overflow-auto">
                        {phoneAccountability[hour].map((staff) => (
                          <div
                            key={staff}
                            className="flex items-center justify-between bg-[#f3f2f1] border border-[#e1dfdd] rounded px-1.5 py-0.5 hover:border-[#6264a7] hover:shadow-sm transition-all duration-200 group"
                          >
                            <span className="font-bold text-[#252423] text-xs truncate">
                              {staff}
                            </span>
                            <button
                              onClick={() =>
                                removePhoneAccountability(hour, staff)
                              }
                              className="p-0.5 rounded-full hover:bg-red-100 transition-colors duration-200 flex-shrink-0"
                            >
                              <X className="h-2.5 w-2.5 text-[#605e5c] group-hover:text-red-500 transition-colors duration-200" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Lunch Break - Bottom */}
          <Card className="bg-white shadow-sm border border-[#e1dfdd] hover:shadow-md transition-shadow duration-200 flex flex-col overflow-hidden">
            <CardHeader className="bg-[#6264a7] text-white py-3 flex-shrink-0">
              <CardTitle className="flex justify-between items-center text-lg font-semibold">
                <span>LUNCH BREAK</span>
                <Button
                  onClick={addLunchBreak}
                  variant="outline"
                  size="sm"
                  className="bg-white text-[#6264a7] hover:bg-[#f3f2f1] border-white hover:border-white transition-all h-7 text-xs font-semibold"
                >
                  Add
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1 overflow-hidden">
              {lunchBreaks.length === 0 ? (
                <p className="text-center text-[#605e5c] py-8 text-sm">
                  No lunch breaks added yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-[#e1dfdd]">
                        <th className="text-left py-2 px-2 font-semibold text-[#252423]">
                          Time
                        </th>
                        <th className="text-left py-2 px-2 font-semibold text-[#252423]">
                          Staff
                        </th>
                        <th className="text-left py-2 px-2 font-semibold text-[#252423]">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {lunchBreaks.map((lunch, index) => (
                        <tr
                          key={index}
                          className="border-b border-[#edebe9] hover:bg-[#f3f2f1] transition-colors"
                        >
                          <td className="py-2 px-2">
                            <Select
                              value={lunch.time}
                              onValueChange={(value) =>
                                updateLunchBreak(index, "time", value)
                              }
                            >
                              <SelectTrigger className="border-[#8a8886] bg-white text-[#252423] focus:ring-[#6264a7] hover:border-[#6264a7] transition-colors h-8 text-xs">
                                <SelectValue placeholder="Time" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-[#e1dfdd]">
                                {getLunchTimeOptions().map((time) => (
                                  <SelectItem key={time} value={time} className="text-[#252423] hover:bg-[#f3f2f1]">
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-2 px-2">
                            <Select
                              value={lunch.staff}
                              onValueChange={(value) =>
                                updateLunchBreak(index, "staff", value)
                              }
                            >
                              <SelectTrigger className="border-[#8a8886] bg-white text-[#252423] focus:ring-[#6264a7] hover:border-[#6264a7] transition-colors h-8 text-xs font-bold">
                                <SelectValue placeholder="Staff" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-[#e1dfdd]">
                                {staffList.map((staff) => (
                                  <SelectItem key={staff} value={staff} className="text-[#252423] hover:bg-[#f3f2f1] font-bold">
                                    {staff}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="py-2 px-2">
                            <Button
                              onClick={() => removeLunchBreak(index)}
                              variant="destructive"
                              size="sm"
                              className="bg-[#c4314b] hover:bg-[#a52a3d] transition-all h-7 text-xs"
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;
