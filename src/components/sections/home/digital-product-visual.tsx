import styles from "./digital-product-visual.module.css";

const workflowStages = ["Capture", "Process", "Deliver"] as const;

export function DigitalProductVisual() {
  return (
    <div
      className={styles.visual}
      role="img"
      aria-label="Abstract illustration of a connected website, workflow automation, and software interface."
    >
      <div className={styles.system} aria-hidden="true">
        <div className={styles.connectorPrimary} />
        <div className={styles.connectorSecondary} />

        <div className={styles.primaryPanel}>
          <div className={styles.browserBar}>
            <div className={styles.browserDots}>
              <span />
              <span />
              <span />
            </div>
            <div className={styles.browserAddress} />
            <span className={styles.connectionStatus}>Connected</span>
          </div>

          <div className={styles.productLayout}>
            <div className={styles.sidebar}>
              <span className={styles.brandMark}>V</span>
              <span className={styles.sidebarLineStrong} />
              <span />
              <span />
              <span />
            </div>

            <div className={styles.workspace}>
              <div className={styles.workspaceHeader}>
                <div>
                  <span className={styles.kicker}>Digital system</span>
                  <span className={styles.titleLine} />
                </div>
                <span className={styles.statusPill}>Active</span>
              </div>

              <div className={styles.systemCards}>
                <div className={styles.systemCard}>
                  <span className={styles.cardLabel}>Website</span>
                  <span className={styles.cardLineWide} />
                  <span className={styles.cardLineShort} />
                </div>
                <div className={styles.systemCard}>
                  <span className={styles.cardLabel}>Automation</span>
                  <div className={styles.signalBars}>
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
                <div className={`${styles.systemCard} ${styles.softwareCard}`}>
                  <span className={styles.cardLabel}>Software</span>
                  <div className={styles.progressTrack}>
                    <span />
                  </div>
                </div>
              </div>

              <div className={styles.activityPanel}>
                <div className={styles.activityHeading}>
                  <span>System activity</span>
                  <span className={styles.liveIndicator}>Live</span>
                </div>
                <div className={styles.activityGraph}>
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.workflowPanel}>
          <div className={styles.panelHeading}>
            <span>Workflow</span>
            <span className={styles.pulse} />
          </div>
          <div className={styles.workflowStages}>
            {workflowStages.map((stage, index) => (
              <div className={styles.workflowStage} key={stage}>
                <span className={styles.stageNumber}>{index + 1}</span>
                <span>{stage}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.portalPanel}>
          <div className={styles.portalTopbar}>
            <span className={styles.portalMark}>V</span>
            <span className={styles.portalMenu} />
          </div>
          <span className={styles.portalLabel}>Client portal</span>
          <span className={styles.portalTitle} />
          <span className={styles.portalCopy} />
          <div className={styles.portalCard}>
            <span />
            <span />
          </div>
          <div className={styles.portalAction} />
        </div>
      </div>
    </div>
  );
}
