import { ComponentProps } from "react";
import { DocumentType } from "../../types";

interface Props extends Omit<ComponentProps<"svg">, "type"> {
  type?: DocumentType;
}

function SitcomDocumentIcon() {
  return (
    <svg width="800px" height="800px" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" stroke-width="3" stroke="#000000" fill="none">
      <path d="M58.94,43.28a2,2,0,0,1-2,2H7.16a2,2,0,0,1-2-2V10.63a2,2,0,0,1,2-2H56.93a2,2,0,0,1,2,2Z" />
      <rect x="10.1" y="13.7" width="43.8" height="26.5" rx=".5" />
      <line x1="27.53" y1="45.55" x2="27.53" y2="51.41" />
      <line x1="37.04" y1="45.55" x2="37.04" y2="51.41" />
      <line x1="18.82" y1="51.54" x2="45.66" y2="51.54" />
    </svg>
  );
}

function PlayDocumentIcon() {
  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 512 512"
    >
      <g>
        <g>
          <g>
            <path
              d="M251.29,239.838c-4.215-2.108-9.344-0.401-11.452,3.814c-0.154,0.299-15.13,29.414-52.105,29.414
				c-36.582,0-51.482-28.211-52.113-29.449c-2.116-4.198-7.228-5.88-11.435-3.78c-4.215,2.108-5.922,7.228-3.814,11.452
				c0.794,1.587,19.977,38.844,67.362,38.844c47.394,0,66.577-37.257,67.371-38.844C257.212,247.066,255.505,241.946,251.29,239.838
				z"
            />
            <path
              d="M161.101,137.745c2.534-14.37-13.611-28.39-37.564-32.614c-4.326-0.759-8.644-1.152-12.843-1.152
				c-18.398,0-31.599,7.441-33.63,18.961c-2.526,14.37,13.619,28.39,37.572,32.614c4.326,0.768,8.644,1.152,12.834,1.152
				C145.877,156.706,159.078,149.265,161.101,137.745z M93.875,125.901c0.171-0.99,5.018-4.855,16.819-4.855
				c3.209,0,6.528,0.299,9.873,0.896c16.273,2.867,24.107,10.761,23.731,12.851c-0.171,0.981-5.018,4.847-16.828,4.847
				c-3.2,0-6.519-0.299-9.865-0.887C101.333,135.876,93.5,127.991,93.875,125.901z"
            />
            <path
              d="M375.467,59.733c0-50.79-24.764-59.733-76.8-59.733c-16.375,0-29.116,5.248-42.607,10.795
				C239.198,17.732,220.075,25.6,187.733,25.6c-32.333,0-51.456-7.868-68.318-14.805C105.924,5.248,93.184,0,76.8,0
				C24.772,0,0,8.943,0,59.733c0,112.956,66.27,332.8,187.733,332.8C309.205,392.533,375.467,172.689,375.467,59.733z
				 M187.733,375.467c-105.873,0-170.667-204.416-170.667-315.733c0-35.482,10.052-42.667,59.733-42.667
				c13.013,0,23.202,4.198,36.122,9.515c17.425,7.159,39.108,16.085,74.812,16.085c35.712,0,57.395-8.926,74.82-16.085
				c12.919-5.316,23.108-9.515,36.113-9.515c49.69,0,59.733,7.185,59.733,42.667C358.4,171.051,293.615,375.467,187.733,375.467z"
            />
            <path
              d="M264.772,103.987c-4.19,0-8.508,0.393-12.834,1.152c-10.257,1.809-19.678,5.598-26.513,10.667
				c-8.516,6.323-12.45,14.114-11.059,21.948c2.031,11.511,15.232,18.961,33.63,18.961c4.19,0,8.508-0.384,12.834-1.152
				c23.953-4.224,40.107-18.244,37.572-32.623C296.371,111.428,283.17,103.987,264.772,103.987z M257.86,138.761
				c-3.337,0.589-6.665,0.887-9.865,0.887c-11.802,0-16.648-3.866-16.828-4.855c-0.068-0.452,0.862-2.628,4.429-5.282
				c4.685-3.473,11.716-6.221,19.311-7.561c3.345-0.597,6.664-0.896,9.865-0.896c11.81,0,16.657,3.866,16.819,4.847
				C281.967,127.991,274.133,135.893,257.86,138.761z"
            />
            <path
              d="M435.2,119.467c-16.299,0-26.897,4.378-39.159,9.455c-3.396,1.408-7.023,2.91-11.051,4.437
				c-4.412,1.664-6.639,6.588-4.966,10.999s6.63,6.63,10.999,4.958c4.216-1.596,7.996-3.157,11.537-4.625
				c11.887-4.907,19.738-8.158,32.64-8.158c49.69,0,59.733,7.185,59.733,42.667c0,111.317-64.785,315.733-170.667,315.733
				c-39.561,0-80.58-31.787-109.713-85.026c-2.261-4.139-7.45-5.649-11.58-3.396c-4.139,2.27-5.649,7.45-3.388,11.588
				C231.757,476.894,278.374,512,324.267,512C445.739,512,512,292.156,512,179.2C512,128.41,487.236,119.467,435.2,119.467z"
            />
            <path
              d="M324.267,358.4c-47.386,0-66.569,37.265-67.362,38.852c-2.108,4.215-0.401,9.344,3.814,11.452s9.344,0.401,11.452-3.814
				c0.154-0.299,15.13-29.423,52.096-29.423c36.591,0,51.49,28.211,52.122,29.449c1.502,2.978,4.506,4.685,7.62,4.685
				c1.289,0,2.586-0.282,3.814-0.896c4.216-2.108,5.922-7.236,3.814-11.452C390.844,395.665,371.661,358.4,324.267,358.4z"
            />
            <path
              d="M434.168,242.406c-2.031-11.511-15.232-18.953-33.63-18.953c-4.19,0-8.508,0.393-12.834,1.152
				c-10.257,1.809-19.678,5.598-26.505,10.667c-8.516,6.323-12.45,14.114-11.068,21.948c2.031,11.511,15.232,18.961,33.63,18.961
				c4.19,0,8.508-0.384,12.834-1.152C420.548,270.805,436.702,256.785,434.168,242.406z M383.761,259.115
				c-11.802,0-16.649-3.866-16.828-4.855c-0.068-0.452,0.862-2.628,4.429-5.282c4.685-3.473,11.716-6.221,19.311-7.561
				c3.345-0.597,6.665-0.896,9.865-0.896c11.81,0,16.657,3.866,16.828,4.847c0.375,2.091-7.458,9.992-23.74,12.86
				C390.289,258.816,386.961,259.115,383.761,259.115z"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}

function MovieDocumentIcon() {
  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      // xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 210.233 210.233"
    // style="enable-background:new 0 0 210.233 210.233;"
    // xml:space="preserve"
    >
      <g>
        <g>
          <g>
            <path
              d="M33.736,86.705c3.297,2.671,7.267,3.969,11.214,3.969c5.206,0,10.366-2.258,13.891-6.608
				c6.19-7.651,5.009-18.911-2.638-25.103c-3.703-3-8.336-4.379-13.101-3.881c-4.741,0.498-9.006,2.812-12.008,6.518
				c-3.002,3.706-4.377,8.357-3.881,13.099C27.712,79.44,30.029,83.703,33.736,86.705z M37.261,66.591
				c1.666-2.059,4.036-3.345,6.67-3.622c0.353-0.037,0.705-0.054,1.054-0.054c2.262,0,4.439,0.767,6.225,2.212
				c4.246,3.44,4.904,9.696,1.464,13.945c-3.44,4.251-9.704,4.906-13.949,1.466c-2.057-1.668-3.347-4.036-3.622-6.67
				C34.828,71.234,35.592,68.65,37.261,66.591z"
            />
            <path
              d="M113.468,134.565c-4.509-1.551-9.347-1.257-13.635,0.835c-4.284,2.09-7.499,5.723-9.053,10.232
				c-1.554,4.509-1.255,9.353,0.833,13.635c2.092,4.286,5.725,7.501,10.234,9.053c1.902,0.656,3.866,0.982,5.826,0.982
				c2.673,0,5.334-0.608,7.81-1.815c4.284-2.09,7.499-5.724,9.053-10.232s1.255-9.353-0.837-13.637
				C121.611,139.334,117.977,136.118,113.468,134.565z M117.032,154.671c-0.86,2.506-2.646,4.524-5.028,5.685
				c-2.382,1.161-5.063,1.33-7.577,0.463c-2.503-0.862-4.52-2.648-5.683-5.028c-1.162-2.38-1.325-5.071-0.461-7.575
				c0.86-2.506,2.646-4.524,5.028-5.685c1.395-0.682,2.874-1.003,4.331-1.003c3.672,0,7.209,2.049,8.929,5.568
				C117.733,149.477,117.896,152.167,117.032,154.671z"
            />
            <path
              d="M150.694,107c-2.526-4.044-6.477-6.86-11.125-7.935c-4.633-1.065-9.421-0.271-13.473,2.256
				c-4.044,2.528-6.86,6.477-7.933,11.123c-2.212,9.589,3.789,19.192,13.38,21.408c1.344,0.31,2.688,0.459,4.013,0.459
				c8.123,0,15.491-5.594,17.393-13.837C154.022,115.83,153.22,111.044,150.694,107z M145.217,118.691
				c-1.228,5.324-6.551,8.652-11.892,7.432c-5.326-1.232-8.662-6.568-7.43-11.896c0.593-2.58,2.161-4.772,4.408-6.176
				c1.596-0.998,3.397-1.511,5.233-1.511c0.748,0,1.503,0.085,2.251,0.256c2.58,0.597,4.776,2.163,6.178,4.41
				C145.372,113.449,145.814,116.109,145.217,118.691z"
            />
            <path
              d="M52.403,112.444c-1.073-4.647-3.889-8.596-7.933-11.123c-4.044-2.527-8.832-3.33-13.473-2.255
				c-4.649,1.073-8.6,3.889-11.125,7.933c-2.525,4.044-3.328,8.83-2.255,13.473c1.902,8.245,9.27,13.837,17.393,13.837
				c1.325,0,2.669-0.147,4.013-0.459C48.615,131.636,54.615,122.033,52.403,112.444z M37.242,126.12
				c-5.322,1.236-10.66-2.106-11.892-7.432c-0.597-2.58-0.155-5.239,1.251-7.484c1.402-2.247,3.599-3.814,6.178-4.408
				c0.748-0.173,1.503-0.257,2.251-0.257c1.836,0,3.637,0.513,5.233,1.511c2.247,1.404,3.816,3.597,4.408,6.176
				C45.903,119.554,42.568,124.891,37.242,126.12z"
            />
            <path
              d="M103.133,53.417c0-9.843-8.007-17.85-17.85-17.85s-17.85,8.007-17.85,17.85s8.007,17.85,17.85,17.85
				S103.133,63.26,103.133,53.417z M85.283,63.333c-5.47,0-9.917-4.449-9.917-9.917c0-5.468,4.447-9.917,9.917-9.917
				c5.47,0,9.917,4.449,9.917,9.917C95.2,58.884,90.753,63.333,85.283,63.333z"
            />
            <path
              d="M125.616,90.674c3.947,0,7.918-1.298,11.214-3.969c3.707-3.002,6.024-7.265,6.523-12.008
				c0.496-4.741-0.879-9.394-3.881-13.099c-6.194-7.647-17.459-8.826-25.105-2.638c-7.651,6.194-8.832,17.455-2.642,25.105
				C115.25,88.415,120.41,90.674,125.616,90.674z M119.356,65.127c4.257-3.446,10.509-2.783,13.949,1.464
				c1.67,2.059,2.433,4.643,2.157,7.277c-0.275,2.634-1.565,5.003-3.622,6.67c-4.257,3.446-10.505,2.785-13.949-1.466
				C114.452,74.823,115.111,68.567,119.356,65.127z"
            />
            <path
              d="M70.734,135.4c-4.288-2.092-9.127-2.388-13.635-0.835c-4.508,1.553-8.142,4.768-10.23,9.053
				c-2.092,4.284-2.39,9.128-0.837,13.637c1.553,4.509,4.768,8.142,9.053,10.232c2.475,1.207,5.136,1.815,7.81,1.815
				c1.956,0,3.924-0.325,5.826-0.982c4.509-1.551,8.142-4.767,10.23-9.051c2.092-4.284,2.39-9.128,0.837-13.637
				C78.235,141.123,75.018,137.489,70.734,135.4z M71.818,155.793c-1.158,2.378-3.177,4.164-5.679,5.026
				c-2.51,0.868-5.195,0.697-7.577-0.463c-2.382-1.16-4.168-3.178-5.028-5.685c-0.864-2.504-0.701-5.195,0.461-7.575
				c1.72-3.519,5.257-5.568,8.929-5.568c1.457,0,2.936,0.322,4.331,1.003c2.382,1.16,4.168,3.178,5.028,5.685
				C73.147,150.72,72.984,153.41,71.818,155.793z"
            />
            <path
              d="M210.209,185.862c-0.239-2.175-2.176-3.761-4.38-3.504c-32.059,3.517-44.853-33.426-45.384-35.001
				c-0.135-0.403-0.371-0.734-0.61-1.059c6.817-12.251,10.733-26.328,10.733-41.315c0-47.025-38.257-85.283-85.283-85.283
				C38.259,19.7,0,57.959,0,104.983c0,47.024,38.257,85.283,85.283,85.283c28.642,0,53.972-14.238,69.445-35.959
				c4.734,10.535,19.118,36.226,46.808,36.226c1.674,0,3.397-0.095,5.167-0.292C208.88,190.001,210.449,188.039,210.209,185.862z
				 M85.283,182.333c-42.65,0-77.35-34.699-77.35-77.35s34.7-77.35,77.35-77.35c42.65,0,77.35,34.699,77.35,77.35
				S127.933,182.333,85.283,182.333z"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}

function QADocumentIcon() {
  return (
    <svg fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
      width="800px" height="800px" viewBox="0 0 100 100" enable-background="new 0 0 100 100">
      <g>
        <path d="M20.074,69H23v12.32c0,0.747,0.416,1.432,1.08,1.775c0.289,0.15,0.605,0.225,0.92,0.225c0.405,0,0.81-0.063,1.153-0.306
		L46.102,69h18.476l9.294,6.292c0.339,0.232,0.733,0.319,1.129,0.319c0.319,0,0.641-0.092,0.934-0.247
		C76.59,75.019,77,74.323,77,73.582V62h3.345C84.955,62,89,57.461,89,52.422V26.183C89,21.45,85.279,18,80.345,18h-44.86
		c-4.47,0-9.274,3-9.467,8h-5.943C14.901,26,11,29.337,11,33.921V60.16C11,64.887,15.155,69,20.074,69z M30,26.183
		C30,23.609,32.836,22,35.484,22h44.86C83.086,22,85,23.65,85,26.183v26.239C85,54.998,83.009,58,80.345,58H75
		c-1.104,0-2,0.776-2,1.881v9.911L56.082,58.289C55.749,58.062,55.355,58,54.953,58H35.484C32.819,58,30,55.074,30,52.422V26.183z
		 M15,33.921C15,31.269,17.553,30,20.074,30H26v22.422C26,57.283,30.609,62,35.484,62h18.851l4.39,3H45.467
		c-0.413,0-0.815,0.068-1.153,0.306L27,77.461v-10.58C27,65.776,26.104,65,25,65h-4.926C17.323,65,15,62.719,15,60.16V33.921z"/>
      </g>
    </svg>
  );
}

export function DocumentIcon({ type, ...props }: Props) {
  switch (type) {
    case "play":
      return <PlayDocumentIcon {...props} />;
    case "sitcom":
      return <SitcomDocumentIcon {...props} />;
    case "movie":
      return <MovieDocumentIcon {...props} />;
    case "qa":
      return <QADocumentIcon {...props} />;
    default:
      return null;
  }
}
