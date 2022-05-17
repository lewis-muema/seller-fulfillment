const googleAuthInit = {
  methods: {
    initGA() {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      document.head.appendChild(script);
    },
  },
};
export default googleAuthInit;
