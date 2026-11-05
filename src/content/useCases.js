// Use cases shown as illustrated cards (home, product landings, Bridge model pages).
// One list, three groups: Nexus, Bridge, Stream. `art` keys come from ./useCaseArt.js; `photo` names a
// photograph in /assets/photos/uc/. A strip shows photos only when every card in it has one.
// `href` is the page the card opens. Nexus cards open the existing solution pages; Stream cards
// open the interactive demo; Bridge cards open the model page.
// Bridge entries carry `model` so a model page can show only its own two.
export const GROUPS = ['Nexus', 'Bridge', 'Stream'];

export const USE_CASES = [
  { group: 'Nexus', art: 'can_ecu', photo: 'can-ecu', title: 'CAN / ECU testing', body: 'Acquire the interface, send only the approved message, gate on decoded signals and package the run as one reviewable artifact.', href: '/solutions/can-ecu-testing', cta: 'See the workflow' },
  { group: 'Nexus', art: 'ros', photo: 'ros', title: 'ROS 2 / DDS testing', body: 'Run unattended hardware tests and judge requirements on live telemetry, without ROS tooling on your side.', href: '/solutions/ros2-dds-testing', cta: 'See the workflow' },
  { group: 'Nexus', art: 'auto', photo: 'auto', title: 'Test automation', body: 'Let agents run, watch and re-run sequences, so an engineer is not needed in the loop for every build.', href: '/solutions/test-orchestration', cta: 'See the workflow' },
  { group: 'Nexus', art: 'hil', photo: 'hil', title: 'AI hardware-in-the-loop', body: 'Give AI agents access to real hardware while you keep control of the boundary.', href: '/solutions/hil-testing', cta: 'See the workflow' },

  { group: 'Bridge', model: 'can', home: true, art: 'b_can', photo: 'b-can', title: 'ECU and BMS validation', body: 'Monitor and transmit frames, decode signals from your DBC and record to ASC, from the browser.', href: '/bridge/can', cta: 'See Bridge CAN' },
  { group: 'Bridge', model: 'can', art: 'b_can2', title: 'Remote automotive diagnostics', body: 'Run UDS and XCP-on-CAN workflows against a bus that sits in another lab, not on your desk.', href: '/bridge/can', cta: 'See Bridge CAN' },
  { group: 'Bridge', model: 'can', art: 'can3', title: 'Shared remote test bench', body: 'Keep the bench in the lab and let the whole team use it from their own browser.', href: '/bridge/can', cta: 'See Bridge CAN' },
  { group: 'Bridge', model: 'serial', home: true, art: 'b_ser', photo: 'b-ser', title: 'Embedded firmware debugging', body: 'Watch the console of a device on the bench from anywhere, send commands and keep a log.', href: '/bridge/serial', cta: 'See Bridge Serial' },
  { group: 'Bridge', model: 'serial', art: 'b_ser2', title: 'Industrial equipment diagnostics', body: 'Reach industrial equipment over RS-232, RS-422 or RS-485, send commands and log the responses without a site visit.', href: '/bridge/serial', cta: 'See Bridge Serial' },
  { group: 'Bridge', model: 'serial', art: 'ser3', title: 'Serial protocol validation', body: 'Send bytes and watch the replies to check a protocol before it ships.', href: '/bridge/serial', cta: 'See Bridge Serial' },
  { group: 'Bridge', model: 'daq', home: true, art: 'b_daq', photo: 'b-daq', title: 'Sensor monitoring', body: 'Watch sensor voltages live in the browser, record the measurement and export the data.', href: '/bridge/daq', cta: 'See Bridge DAQ' },
  { group: 'Bridge', model: 'daq', art: 'b_daq2', title: 'ECU signal validation', body: 'Check analog signals during a test and keep the measurement inside the automated workflow.', href: '/bridge/daq', cta: 'See Bridge DAQ' },
  { group: 'Bridge', model: 'daq', art: 'daq3', title: 'Laboratory experiments', body: 'Record up to 7 voltage channels during an experiment and export the data.', href: '/bridge/daq', cta: 'See Bridge DAQ' },
  { group: 'Bridge', model: 'io', home: true, art: 'b_io', photo: 'b-io', title: 'ECU test fixtures', body: 'Switch digital outputs and read inputs of a test fixture from anywhere.', href: '/bridge/io', cta: 'See Bridge I/O' },
  { group: 'Bridge', model: 'io', art: 'b_io2', title: 'Sensor simulation', body: 'Drive a 0-10 V signal to stand in for a sensor while a test sequence runs.', href: '/bridge/io', cta: 'See Bridge I/O' },
  { group: 'Bridge', model: 'io', art: 'io3', title: 'Automated functional testing', body: 'Run a sequence that drives outputs, reads inputs and checks the result.', href: '/bridge/io', cta: 'See Bridge I/O' },

  { group: 'Stream', art: 'st_motor', photo: 'st-motor', title: 'Motor test bench', body: 'A reading becomes an event with the device, test session and values kept together.', href: '/stream/demo', cta: 'Try it in the demo' },
  { group: 'Stream', art: 'st_ver', photo: 'st-verdict', title: 'Automated test verdicts', body: 'Your test runner supplies the verdict and the context needed to investigate it later.', href: '/stream/demo', cta: 'Try it in the demo' },
  { group: 'Stream', art: 'st_limit', photo: 'st-limit', title: 'Temperature limit alerts', body: 'Your script detects a threshold crossing and records the reading alongside its configured limit.', href: '/stream/demo', cta: 'Try it in the demo' },
  { group: 'Stream', art: 'st_search', photo: 'st-search', title: 'Session investigation', body: 'Search the history and filter by device or session to find the moment that matters.', href: '/stream/demo', cta: 'Try it in the demo' },
];

export const homeUseCases = () => USE_CASES.filter((u) => u.group !== 'Bridge' || u.home);
export const modelUseCases = (model) => USE_CASES.filter((u) => u.model === model);
