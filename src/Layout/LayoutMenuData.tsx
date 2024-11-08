import React, { useEffect, useState } from "react";

const Navdata = () => {
  //state data

  const [isTracking, setIsTracking] = useState(false);
  const [isStudents, setIsStudents] = useState(false);
  const [isSchedle, setIsSchedle] = useState(false);
  const [isFeedbackClaims, setIsFeedbackClaims] = useState(false);
  const [isPayement, setIsPayement] = useState(false);
  const [isAccounts, setIsAccounts] = useState(false);
  const [isTools, setIsTools] = useState(false);
  const [isHelp, setIsHelp] = useState(false);
  const [isMessagerie, setIsMessagerie] = useState(false);
  const [isMultiLevel, setIsMultiLevel] = useState(false);

  // Multi Level
  const [isLevel1, setIsLevel1] = useState(false);
  const [isLevel2, setIsLevel2] = useState(false);

  const [iscurrentState, setIscurrentState] = useState("Dashboard");

  function updateIconSidebar(e: any) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul: any = document.getElementById("two-column-menu");
      const iconItems: any = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        // var id: any = item.getAttribute("subitems");
        // if (document.getElementById(id)){
        //     document.getElementById(id).classList.remove("show");
        // }
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");

    if (iscurrentState !== "Tracking") {
      setIsTracking(false);
    }
    if (iscurrentState !== "Messagerie") {
      setIsMessagerie(false);
    }
    if (iscurrentState !== "Students") {
      setIsStudents(false);
    }
    if (iscurrentState !== "Programming") {
      setIsSchedle(false);
    }
    if (iscurrentState !== "Feedback&Claims") {
      setIsFeedbackClaims(false);
    }
    if (iscurrentState !== "Payement") {
      setIsPayement(false);
    }
    if (iscurrentState !== "Accounts") {
      setIsAccounts(false);
    }
    if (iscurrentState !== "Tools") {
      setIsTools(false);
    }
    if (iscurrentState !== "Help") {
      setIsHelp(false);
    }
    if (iscurrentState !== "MuliLevel") {
      setIsMultiLevel(false);
    }
  }, [
    iscurrentState,
    isTracking,
    isStudents,
    isSchedle,
    isFeedbackClaims,
    isPayement,
    isAccounts,
    isTools,
    isHelp,
    isMessagerie,
    isMultiLevel,
  ]);

  const menuItems: any = [
    {
      label: "Menu",
      isHeader: true,
    },
    {
      id: "Dashboard",
      label: "Tableau de bord",
      icon: "ph ph-gauge",
      link: "/dashboard",
    },
    {
      id: "invoices",
      label: "Inscriptions",
      link: "/inscriptions",
      parentId: "invoices",
      icon: "ph ph-address-book",
    },
    {
      id: "invoices",
      label: "Bulletins",
      link: "/bulletins",
      parentId: "invoices",
      icon: "ph ph-file-plus",
    },
    {
      id: "invoices",
      label: "Notes",
      link: "/notes",
      parentId: "invoices",
      icon: "ph ph-exam",
    },
    {
      id: "invoices",
      label: "Absence",
      link: "/absence",
      parentId: "invoices",
      icon: "ph ph-user-list",
    },
    {
      id: "invoices",
      label: "Discipline",
      link: "/discipline",
      parentId: "invoices",
      icon: "ph ph-users-four",
    },
    {
      id: "invoices",
      label: "Observations",
      link: "/observations",
      parentId: "invoices",
      icon: "ph ph-note-pencil",
    },
    {
      id: "invoices",
      label: "Travail à la maison",
      link: "/exercices",
      parentId: "invoices",
      icon: "ph ph-house",
    },
    {
      id: "multilevel",
      label: "Planification",
      icon: "ph ph-target",
      link: "/#",
      click: function (e: any) {
        e.preventDefault();
        setIsMultiLevel(!isMultiLevel);
        setIscurrentState("MuliLevel");
        updateIconSidebar(e);
      },
      stateVariables: isMultiLevel,
      subItems: [
        {
          id: "invoices",
          label: "Emploi",
          link: "/emploi",
          parentId: "invoices",
          icon: "ph ph-calendar-blank",
        },
        {
          id: "level1.2",
          label: "Calendrier Examen",
          link: "/#",
          icon: "ph ph-calendar-check",
          isChildItem: true,
          click: function (e: any) {
            e.preventDefault();
            setIsLevel1(!isLevel1);
          },
          stateVariables: isLevel1,
          childItems: [
            {
              id: 1,
              label: "Devoirs Contrôle",
              link: "/calendrier-examen-contrôle",
              icon: "ph ph-calendar",
            },
            {
              id: 2,
              label: "Devoirs Synthèse",
              link: "/calendrier-examen-synthèse",
              icon: "ph ph-calendar-plus",
            },
          ],
        },
      ],
    },
    {
      id: "invoices",
      label: "Paiement",
      link: "/paiement",
      parentId: "invoices",
      icon: "ph ph-wallet",
    },
    {
      id: "SMS",
      label: "SMS",
      icon: "ph ph-chat-circle-text",
      link: "/#",
      click: function (e: any) {
        e.preventDefault();
        setIsAccounts(!isAccounts);
        setIscurrentState("Accounts");
        updateIconSidebar(e);
      },
      stateVariables: isAccounts,
      subItems: [
        {
          id: "invoices",
          label: "SMS Enseignants",
          link: "/sms-enseignants",
          parentId: "invoices",
          icon: "ph ph-chats",
        },
        {
          id: "invoices",
          label: "SMS Parents",
          link: "/sms-parents",
          parentId: "invoices",
          icon: "ph ph-chats-teardrop",
        },
        {
          id: "invoices",
          label: "Paramètres",
          link: "/paremètres-sms",
          parentId: "invoices",
          icon: "ph ph-toggle-right",
        },
      ],
    },
    {
      id: "invoices",
      label: "Rendez-vous",
      link: "/rendez-vous",
      parentId: "invoices",
      icon: "ph ph-clock",
    },
    {
      id: "Activity",
      label: "Activités et Témoignages",
      icon: "ph ph-sparkle",
      link: "/#",
      click: function (e: any) {
        e.preventDefault();
        setIsTracking(!isTracking);
        setIscurrentState("Tracking");
        updateIconSidebar(e);
      },
      stateVariables: isTracking,
      subItems: [
        {
          id: "invoices",
          label: "Gallerie",
          link: "/gallerie",
          parentId: "invoices",
          icon: "ph ph-aperture",
        },
        {
          id: "invoices",
          label: "Avis",
          link: "/avis",
          parentId: "invoices",
          icon: "ph ph-notebook",
        },
        {
          id: "invoices",
          label: "Evènements",
          link: "/evènements",
          parentId: "invoices",
          icon: "ph ph-calendar",
        },
      ],
    },
    {
      id: "Messagerie",
      label: "Messages",
      icon: "ph ph-chat-dots",
      link: "/#",
      click: function (e: any) {
        e.preventDefault();
        setIsMessagerie(!isMessagerie);
        setIscurrentState("Messagerie");
        updateIconSidebar(e);
      },
      stateVariables: isMessagerie,
      subItems: [
        {
          id: "invoices",
          label: "Messages individuels",
          link: "/messages-individuels",
          parentId: "Messagerie",
          icon: "ph ph-user-circle",
        },
        {
          id: "invoices",
          label: "Messages de groupe",
          link: "/messages-groupe",
          parentId: "Messagerie",
          icon: "ph ph-users-three",
        },
      ],
    },
    {
      id: "invoices",
      label: "Documents",
      link: "/documents",
      parentId: "invoices",
      icon: "ph ph-files",
    },
    {
      id: "Help",
      label: "Restauration",
      icon: "ph ph-fork-knife",
      link: "/#",
      click: function (e: any) {
        e.preventDefault();
        setIsHelp(!isHelp);
        setIscurrentState("Help");
        updateIconSidebar(e);
      },
      stateVariables: isHelp,
      subItems: [
        {
          id: "invoices",
          label: "Cantines",
          link: "/cantines",
          parentId: "invoices",
          icon: "ph ph-hamburger",
        },
        {
          id: "invoices",
          label: "Abonnements",
          link: "/abonnements",
          parentId: "invoices",
          icon: "ph ph-identification-badge",
        },
      ],
    },
    {
      id: "Administration",
      label: "Administration",
      icon: "ph ph-gear",
      link: "/#",
      click: function (e: any) {
        e.preventDefault();
        setIsStudents(!isStudents);
        setIscurrentState("Students");
        updateIconSidebar(e);
      },
      stateVariables: isStudents,
      subItems: [
        {
          id: "invoices",
          label: "Enseignants",
          link: "/enseignants",
          parentId: "invoices",
          icon: "ph ph-chalkboard-teacher",
        },
        {
          id: "invoices",
          label: "Parents",
          link: "/parents",
          parentId: "invoices",
          icon: "ph ph-user",
        },
        {
          id: "invoices",
          label: "Elèves",
          link: "/etudiants",
          parentId: "invoices",
          icon: "ph ph-student",
        },

        {
          id: "profile",
          label: "Classes",
          link: "/classes",
          parentId: "profile",
          icon: "ph ph-door",
        },
        {
          id: "invoices",
          label: "Matières",
          link: "/matieres",
          parentId: "invoices",
          icon: "ph ph-books",
        },
        {
          id: "invoices",
          label: "Niveaux",
          link: "/niveaux",
          parentId: "invoices",
          icon: "ph ph-trend-up",
        },
        {
          id: "profile",
          label: "Surveillants",
          link: "/surveillants",
          parentId: "profile",
          icon: "ph ph-user-square",
        },
        {
          id: "profile",
          label: "Salles",
          link: "/salles",
          parentId: "profile",
          icon: "ph ph-buildings",
        },
      ],
    },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
