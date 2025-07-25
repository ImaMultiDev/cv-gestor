import React from "react";
import { Certification, CVFormat } from "@/types/cv";

interface CertificationsSectionProps {
  certifications: Certification[];
  format: CVFormat;
  className?: string;
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({
  certifications,
  format,
  className = "",
}) => {
  const selectedCertifications = certifications?.filter(
    (cert) => cert.selected
  );

  if (!selectedCertifications || selectedCertifications.length === 0) {
    return null;
  }

  if (format === "visual") {
    return (
      <div className={className} style={{ marginBottom: "2rem" }}>
        <h2 className="cv-section-title">Certificaciones</h2>
        {selectedCertifications.map((certification, index) => (
          <div key={index} style={{ marginBottom: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "0.5rem",
              }}
            >
              <div
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#374151",
                  lineHeight: "1.5rem",
                }}
              >
                {certification.name}
              </div>
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  fontWeight: "500",
                }}
              >
                {certification.date}
              </span>
            </div>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#374151",
                marginBottom: "0.25rem",
              }}
            >
              {certification.issuer}
            </p>
            {certification.credentialId && (
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#6b7280",
                  marginBottom: "0.25rem",
                }}
              >
                <strong>ID:</strong> {certification.credentialId}
              </p>
            )}
            {certification.url && (
              <p style={{ fontSize: "0.75rem", color: "#0891b2" }}>
                <strong>Verificación:</strong> {certification.url}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (format === "europass") {
    return (
      <div className={className} style={{ marginBottom: "2rem" }}>
        <h2 className="cv-section-title europass">Certificaciones</h2>
        {selectedCertifications.map((certification, index) => (
          <div key={index} style={{ marginBottom: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "0.5rem",
              }}
            >
              <div
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#374151",
                  lineHeight: "1.5rem",
                }}
              >
                {certification.name}
              </div>
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  fontWeight: "500",
                }}
              >
                {certification.date}
              </span>
            </div>
            <p
              style={{
                fontSize: "0.875rem",
                color: "#374151",
                marginBottom: "0.25rem",
              }}
            >
              {certification.issuer}
            </p>
            {certification.credentialId && (
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#6b7280",
                  marginBottom: "0.25rem",
                }}
              >
                <strong>ID:</strong> {certification.credentialId}
              </p>
            )}
            {certification.url && (
              <p style={{ fontSize: "0.75rem", color: "#003399" }}>
                <strong>Verificación:</strong> {certification.url}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Formato ATS
  return (
    <div className={className} style={{ marginBottom: "1rem" }}>
      <h2
        style={{
          fontSize: "0.875rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          paddingBottom: "0.25rem",
          borderBottom: "1px solid #000000",
          color: "#000000",
          lineHeight: "1.75rem",
        }}
      >
        CERTIFICACIONES
      </h2>
      <div style={{ marginTop: "1rem" }}>
        {selectedCertifications.map((certification, index) => (
          <div key={index} style={{ marginTop: "0.2rem" }}>
            <span
              style={{
                fontSize: "0.875rem",
                fontWeight: "600",
                color: "#000000",
              }}
            >
              {certification.name}
              {" : "}
            </span>
            <span
              style={{
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "#000000",
              }}
            >
              {certification.issuer} {"("} {certification.date} {")"}
            </span>
            {certification.credentialId && (
              <span style={{ fontSize: "0.875rem", color: "#000000" }}>
                ID: {certification.credentialId}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
