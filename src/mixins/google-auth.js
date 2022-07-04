/* eslint-disable no-undef */
const googleAuthInit = {
  methods: {
    initiateGA(googleClientId) {
      const script = document.createElement("script");
      script.onload = () => {
        google.accounts.id.initialize({
          client_id: googleClientId,
          callback: this.handleCredentialResponse,
        });
        google.accounts.id.renderButton(
          document.getElementById("google-signin-btn"),
          {
            theme: "outline",
            size: "large",
            width: "350",
            logo_alignment: "center",
          }
        );
        google.accounts.id.prompt();
      };
      script.src = "https://accounts.google.com/gsi/client";
      document.head.appendChild(script);
    },
  },
};
export default googleAuthInit;
