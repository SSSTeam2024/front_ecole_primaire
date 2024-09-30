import React, { useState } from "react";

import { useFetchParentsQuery } from "features/parents/parentSlice";
import { useFetchEtudiantsQuery } from "features/etudiants/etudiantSlice";
const AlertMessage = () => {
  const { data: AllEleves = [] } = useFetchEtudiantsQuery();
  const { data = [] } = useFetchParentsQuery();
  const [showAlert, setShowAlert] = useState(true);

  const handleCloseAlert = () => {
    setShowAlert(false);
  };
  const filsExistsInParents = data.some((parent) => parent?.fils!.length === 0);
  const parentsExistsInEleves = AllEleves.some(
    (eleve) => eleve?.parent === null
  );

  return (
    <React.Fragment>
      {(filsExistsInParents || parentsExistsInEleves) && showAlert && (
        <div
          className="alert alert-warning alert-modern alert-dismissible fade show"
          role="alert"
        >
          <i className="ri-alert-line icons"></i> L'absence des
          <i>Parents</i> dans <i>élèves</i>, ou des <i>élèves </i>
          dans <i>Parents</i>, pourrait entraîner des problèmes lors de l'envoi
          des
          <strong> SMS</strong>.
          <button
            type="button"
            className="btn-close"
            onClick={handleCloseAlert}
            aria-label="Close"
          ></button>
        </div>
      )}
    </React.Fragment>
  );
};

export default AlertMessage;
