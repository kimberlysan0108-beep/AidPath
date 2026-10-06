import json,subprocess
from hypothesis import given,settings,strategies as st
from pathlib import Path
PROGRAMS=json.loads(Path('data/programs.json').read_text())
@given(st.lists(st.sampled_from(['yes','no','unknown']),min_size=1,max_size=40))
@settings(max_examples=20,deadline=None)
def test_required_failures_and_provenance(values):
    program={**next(p for p in PROGRAMS if p['id']=='emergency-fund'),'policy_review_status':'APPROVED'}
    cases=[{'program':program,'answers':{'need':'financial','enrolled':v,'exhausted':'yes','recent_award':'no','unexpected':'yes'}} for v in values]
    result=json.loads(subprocess.check_output(['node','--import','./tests/loader.mjs','tests/property_bridge.mjs'],input=json.dumps(cases).encode()))
    for v,r in zip(values,result):
        assert r['evaluation']['status']!='confirmed_eligible'
        if v=='no': assert r['evaluation']['status']=='not_matched' and not r['recommendations']
        for rec in r['recommendations']:assert rec['source_url'] and rec['policy_version'] and rec['source_hash']
